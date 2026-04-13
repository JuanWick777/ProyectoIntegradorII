package com.integradora.back.controller.categoria;

import com.integradora.back.controller.categoria.dto.CategoriaRequestDTO;
import com.integradora.back.controller.categoria.dto.CategoriaResponseDTO;
import com.integradora.back.model.categoria.Categoria;
import com.integradora.back.service.CategoriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@RequiredArgsConstructor
public class CategoriaController {

    private final CategoriaService service;

    @PostMapping
    public CategoriaResponseDTO crear(@Valid @RequestBody CategoriaRequestDTO req) {
        Categoria categoria = Categoria.builder().nombre(req.getNombre()).build();
        return CategoriaResponseDTO.from(service.crear(categoria));
    }

    @GetMapping
    public List<CategoriaResponseDTO> listar() {
        return service.listar().stream().map(CategoriaResponseDTO::from).toList();
    }
}