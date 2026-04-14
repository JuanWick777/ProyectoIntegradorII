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
        if (numero == null || numero <= 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "El número de mesa debe ser mayor a 0"));
        }

        if (mesaRepository.existsByNumero(numero)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Ya existe una mesa con ese número"));
        }

        Mesa creada = mesaRepository.save(Mesa.builder()
                .numero(numero)
                .estado("LIBRE")
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
                            return ResponseEntity.badRequest().body(Map.of("error", "Número de mesa inválido"));
                        }

                        if (!mesa.getNumero().equals(nuevoNumero) && mesaRepository.existsByNumero(nuevoNumero)) {
                            return ResponseEntity.status(HttpStatus.CONFLICT)
                                    .body(Map.of("error", "Ya existe una mesa con ese número"));
                        }

                        mesa.setNumero(nuevoNumero);
                    }

                    if (body.containsKey("estado") && body.get("estado") != null) {
                        String estado = String.valueOf(body.get("estado")).trim();
                        if (!estado.isEmpty()) {
                            mesa.setEstado(estado.toUpperCase());
                        }
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

    /**
     * Valida que una mesa exista por su número visible.
     * El front lo llama desde MesaIngreso cuando el cliente escribe su número manualmente.
     * GET /api/mesas/{numero}
     */
    @GetMapping("/{numero}")
    public ResponseEntity<MesaResponseDTO> obtenerPorNumero(@PathVariable Integer numero) {
        return mesaRepository.findByNumero(numero)
                .map(MesaResponseDTO::from)
                .map(ResponseEntity::ok)
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
}
