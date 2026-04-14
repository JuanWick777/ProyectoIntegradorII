package com.restaurante.api.controller;

import com.restaurante.api.entity.Mesa;
import com.restaurante.api.repository.MesaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.Map;

@RestController
@RequestMapping("/api/mesas")
@RequiredArgsConstructor
public class MesaController {

    private final MesaRepository mesaRepo;

    /**
     * GET /api/mesas/{numero}
     * Consulta el estado de una mesa. Retorna 409 si está ocupada.
     * PÚBLICO — el cliente de mesa no tiene sesión.
     */
    @GetMapping("/{numero}")
    public ResponseEntity<?> show(@PathVariable Integer numero) {
        Mesa mesa = mesaRepo.findByNumero(numero)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Mesa no encontrada"));

        if (mesa.getEstado() == Mesa.Estado.ocupada) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "La mesa ya está ocupada"));
        }

        return ResponseEntity.ok(Map.of(
                "id", mesa.getId(),
                "numero", mesa.getNumero(),
                "estado", mesa.getEstado().name()));
    }

    /**
     * GET /api/mesas
     * Lista todas las mesas (para el dashboard del mesero/admin).
     */
    @GetMapping
    public ResponseEntity<?> index() {
        var mesas = mesaRepo.findAll().stream().map(m -> Map.of(
                "id", m.getId(),
                "numero", m.getNumero(),
                "estado", m.getEstado().name())).toList();
        return ResponseEntity.ok(mesas);
    }

    /**
     * POST /api/mesas
     * Crea una nueva mesa. Requiere número único.
     * Solo para administrador.
     */
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, Object> payload) {
        Integer numero = null;
        try {
            numero = ((Number) payload.get("numero")).intValue();
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "El número de mesa es requerido y debe ser numérico");
        }

        if (numero < 1) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "El número de mesa debe ser mayor a 0");
        }

        if (mesaRepo.findByNumero(numero).isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Ya existe una mesa con el número " + numero);
        }

        Mesa mesa = new Mesa();
        mesa.setNumero(numero);
        mesa.setEstado(Mesa.Estado.libre);

        Mesa mesaGuardada = mesaRepo.save(mesa);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "id", mesaGuardada.getId(),
                "numero", mesaGuardada.getNumero(),
                "estado", mesaGuardada.getEstado().name()));
    }

    /**
     * DELETE /api/mesas/{id}
     * Elimina una mesa por ID.
     * Solo para administrador.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        Mesa mesa = mesaRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Mesa no encontrada"));

        mesaRepo.deleteById(id);

        return ResponseEntity.ok(Map.of(
                "mensaje", "Mesa eliminada correctamente",
                "id", mesa.getId(),
                "numero", mesa.getNumero()));
    }

    /**
     * PUT /api/mesas/{id}
     * Actualiza el estado de una mesa.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        Mesa mesa = mesaRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Mesa no encontrada"));

        String nuevoEstado = payload.get("estado");
        if (nuevoEstado == null || nuevoEstado.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "El estado es requerido");
        }

        try {
            Mesa.Estado estado = Mesa.Estado.valueOf(nuevoEstado.toLowerCase());
            mesa.setEstado(estado);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Estado inválido. Debe ser 'libre' u 'ocupada'");
        }

        Mesa mesaActualizada = mesaRepo.save(mesa);

        return ResponseEntity.ok(Map.of(
                "id", mesaActualizada.getId(),
                "numero", mesaActualizada.getNumero(),
                "estado", mesaActualizada.getEstado().name()));
    }
}
