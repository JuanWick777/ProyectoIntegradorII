package com.integradora.back.controller.mesa;

import com.integradora.back.controller.mesa.dto.MesaResponseDTO;
import com.integradora.back.model.mesa.Mesa;
import com.integradora.back.repository.MesaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/mesas")
@RequiredArgsConstructor
public class MesaController {

    private final MesaRepository mesaRepository;

    @GetMapping
    public ResponseEntity<List<MesaResponseDTO>> listarMesas() {
        List<MesaResponseDTO> mesas = mesaRepository.findAllByOrderByNumeroAsc()
                .stream()
                .map(MesaResponseDTO::from)
                .toList();

        return ResponseEntity.ok(mesas);
    }

    @PostMapping
    public ResponseEntity<?> crearMesa(@RequestBody Map<String, Object> body) {
        Integer numero = parseNumero(body.get("numero"));
        Integer capacidad = parseNumero(body.get("capacidad"));

        if (numero == null || numero <= 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "El numero de mesa debe ser mayor a 0"));
        }

        if (capacidad == null || capacidad <= 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "La capacidad de la mesa debe ser mayor a 0"));
        }

        if (mesaRepository.existsByNumero(numero)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Ya existe una mesa con ese numero"));
        }

        Mesa creada = mesaRepository.save(Mesa.builder()
                .numero(numero)
                .capacidad(capacidad)
                .estado("LIBRE")
                .cuentaAbierta(0)
                .qrActivo(1)
                .build());

        return ResponseEntity.status(HttpStatus.CREATED).body(MesaResponseDTO.from(creada));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarMesa(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body
    ) {
        return mesaRepository.findById(id)
                .map(mesa -> {
                    if (body.containsKey("numero")) {
                        Integer nuevoNumero = parseNumero(body.get("numero"));
                        if (nuevoNumero == null || nuevoNumero <= 0) {
                            return ResponseEntity.badRequest().body(Map.of("error", "Numero de mesa invalido"));
                        }

                        if (!mesa.getNumero().equals(nuevoNumero) && mesaRepository.existsByNumero(nuevoNumero)) {
                            return ResponseEntity.status(HttpStatus.CONFLICT)
                                    .body(Map.of("error", "Ya existe una mesa con ese numero"));
                        }

                        mesa.setNumero(nuevoNumero);
                    }

                    if (body.containsKey("capacidad")) {
                        Integer nuevaCapacidad = parseNumero(body.get("capacidad"));
                        if (nuevaCapacidad == null || nuevaCapacidad <= 0) {
                            return ResponseEntity.badRequest().body(Map.of("error", "Capacidad de mesa invalida"));
                        }
                        mesa.setCapacidad(nuevaCapacidad);
                    }

                    if (body.containsKey("estado") && body.get("estado") != null) {
                        String estado = String.valueOf(body.get("estado")).trim();
                        if (!estado.isEmpty()) {
                            mesa.setEstado(estado.toUpperCase());
                        }
                    }

                    if (body.containsKey("qrActivo") && body.get("qrActivo") != null) {
                        mesa.setQrActivo(parseBooleanFlag(body.get("qrActivo")) ? 1 : 0);
                    }

                    if (body.containsKey("cuentaAbierta") && body.get("cuentaAbierta") != null) {
                        mesa.setCuentaAbierta(parseBooleanFlag(body.get("cuentaAbierta")) ? 1 : 0);
                    }

                    Mesa guardada = mesaRepository.save(mesa);
                    return ResponseEntity.ok(MesaResponseDTO.from(guardada));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarMesa(@PathVariable Long id) {
        if (!mesaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        mesaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{numero}")
    public ResponseEntity<?> obtenerPorNumero(@PathVariable Integer numero) {
        return mesaRepository.findByNumero(numero)
                .map(mesa -> {
                    if (mesa.getQrActivo() != null && mesa.getQrActivo() == 0) {
                        return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
                    }

                    if ("INACTIVA".equalsIgnoreCase(mesa.getEstado())) {
                        return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
                    }

                    if (mesa.getCuentaAbierta() != null && mesa.getCuentaAbierta() == 1) {
                        return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
                    }

                    return ResponseEntity.ok(MesaResponseDTO.from(mesa));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private Integer parseNumero(Object numeroRaw) {
        if (numeroRaw == null) return null;

        if (numeroRaw instanceof Number number) {
            return number.intValue();
        }

        try {
            return Integer.parseInt(String.valueOf(numeroRaw));
        } catch (NumberFormatException ex) {
            return null;
        }
    }

    private boolean parseBooleanFlag(Object rawValue) {
        if (rawValue instanceof Boolean booleanValue) {
            return booleanValue;
        }

        if (rawValue instanceof Number number) {
            return number.intValue() != 0;
        }

        String value = String.valueOf(rawValue).trim();
        return "true".equalsIgnoreCase(value) || "1".equals(value) || "si".equalsIgnoreCase(value);
    }
}
