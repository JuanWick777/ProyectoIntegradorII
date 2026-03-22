package com.integradora.back.controller;

import com.integradora.back.model.Orden;
import com.integradora.back.service.OrdenService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ordenes")
@RequiredArgsConstructor
public class OrdenController {

    private final OrdenService service;

    @PostMapping
    public Orden crear(
            @RequestParam Long clienteId,
            @RequestParam Long mesaId
    ) {
        return service.crear(clienteId, mesaId);
    }

    @GetMapping
    public List<Orden> listar() {
        return service.listar();
    }

    @GetMapping("/cliente/{clienteId}")
    public List<Orden> porCliente(@PathVariable Long clienteId) {
        return service.porCliente(clienteId);
    }

    @PutMapping("/{id}/estado")
    public Orden actualizarEstado(
            @PathVariable Long id,
            @RequestParam String estado
    ) {
        return service.actualizarEstado(id, estado);
    }
}