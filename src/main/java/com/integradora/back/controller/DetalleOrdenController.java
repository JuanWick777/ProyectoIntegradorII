package com.integradora.back.controller;

import com.integradora.back.model.DetalleOrden;
import com.integradora.back.service.DetalleOrdenService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/detalles")
@RequiredArgsConstructor
public class DetalleOrdenController {

    private final DetalleOrdenService service;

    @PostMapping
    public DetalleOrden agregar(
            @RequestParam Long ordenId,
            @RequestParam Long platilloId,
            @RequestParam Integer cantidad,
            @RequestParam(required = false) String nota
    ) {
        return service.agregarDetalle(ordenId, platilloId, cantidad, nota);
    }

    @GetMapping("/orden/{ordenId}")
    public List<DetalleOrden> obtenerPorOrden(@PathVariable Long ordenId) {
        return service.obtenerPorOrden(ordenId);
    }
}