package com.integradora.back.controller.platillo;

import com.integradora.back.controller.platillo.dto.PlatilloAdminDTO;
import com.integradora.back.controller.platillo.dto.PlatilloResponseDTO;
import com.integradora.back.model.platillo.Platillo;
import com.integradora.back.service.PlatilloService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/platillos")
@RequiredArgsConstructor
public class PlatilloController {

    private final PlatilloService service;

    @PostMapping("/{categoriaId}")
    public PlatilloResponseDTO crear(
            @Valid @RequestBody PlatilloAdminDTO dto,
            @PathVariable Long categoriaId
    ) {
        Platillo platillo = new Platillo();
        platillo.setNombre(dto.getNombre());
        platillo.setDescripcion(dto.getDescripcion());
        platillo.setPrecio(dto.getPrecio());
        platillo.setUrlImagen(dto.getImagenUrl());
        platillo.setDisponibilidad(dto.getDisponibilidad());
        Platillo creado = service.crear(platillo, categoriaId);
        return PlatilloResponseDTO.from(creado);
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