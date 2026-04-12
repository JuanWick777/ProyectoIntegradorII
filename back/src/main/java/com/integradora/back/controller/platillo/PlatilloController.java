package com.integradora.back.controller.platillo;

import com.integradora.back.controller.platillo.dto.PlatilloResponseDTO;
import com.integradora.back.model.platillo.Platillo;
import com.integradora.back.service.PlatilloService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/platillos")
@RequiredArgsConstructor
public class PlatilloController {

    private final PlatilloService service;

    @PostMapping("/{categoriaId}")
    public Platillo crear(
            @RequestBody Platillo platillo,
            @PathVariable Long categoriaId
    ) {
        return service.crear(platillo, categoriaId);
    }

    @GetMapping
    public List<PlatilloResponseDTO> listar() {
        return service.listar().stream()
                .map(PlatilloResponseDTO::from)
                .toList();
    }

    @GetMapping("/categoria/{categoriaId}")
    public List<PlatilloResponseDTO> porCategoria(@PathVariable Long categoriaId) {
        return service.listarPorCategoria(categoriaId).stream()
                .map(PlatilloResponseDTO::from)
                .toList();
    }
}