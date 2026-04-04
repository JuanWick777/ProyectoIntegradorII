package com.integradora.back.controller.categoria;

import com.integradora.back.model.Categoria;
import com.integradora.back.service.CategoriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class CategoriaController {

    private final CategoriaService service;

    @PostMapping
    public Categoria crear(@RequestBody Categoria categoria) {
        return service.crear(categoria);
    }

    @GetMapping
    public List<Categoria> listar() {
        return service.listar();
    }
}