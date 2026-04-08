package com.integradora.back.controller.detalleorden;

import com.integradora.back.model.detalleorden.DetalleOrden;
import com.integradora.back.service.DetalleOrdenService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/detalles")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
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

    @GetMapping("/pendientes")
    public List<DetalleOrden> obtenerPendientes() {
        return service.obtenerPendientes();
    }

    @PutMapping("/{id}/estado")
    public DetalleOrden cambiarEstado(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        return service.cambiarEstado(id, body.get("estado"));
    }
}