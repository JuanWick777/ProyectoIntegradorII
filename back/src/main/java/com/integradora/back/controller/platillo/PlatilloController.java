package com.integradora.back.controller.platillo;

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
    public List<Platillo> listar() {
        return service.listar();
    }

    @GetMapping("/categoria/{categoriaId}")
    public List<Platillo> porCategoria(@PathVariable Long categoriaId) {
        return service.listarPorCategoria(categoriaId);
    }
}