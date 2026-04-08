package com.integradora.back.controller.mesa;

import com.integradora.back.model.mesa.Mesa;
import com.integradora.back.repository.MesaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mesas")
@RequiredArgsConstructor
public class MesaController {

    private final MesaRepository mesaRepository;

    /**
     * Valida que una mesa exista por su número visible.
     * El front lo llama desde MesaIngreso cuando el cliente escribe su número manualmente.
     * GET /api/mesas/{numero}
     */
    @GetMapping("/{numero}")
    public ResponseEntity<Mesa> obtenerPorNumero(@PathVariable Integer numero) {
        return mesaRepository.findByNumero(numero)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
