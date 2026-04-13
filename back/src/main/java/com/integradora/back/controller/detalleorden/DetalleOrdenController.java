package com.integradora.back.controller.detalleorden;

import com.integradora.back.controller.detalleorden.dto.DetalleOrdenDTO;
import com.integradora.back.model.detalleorden.DetalleOrden;
import com.integradora.back.service.DetalleOrdenService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/detalle-orden")
@RequiredArgsConstructor
public class DetalleOrdenController {

    private final DetalleOrdenService service;

    @PostMapping
    public DetalleOrdenDTO agregar(
            @RequestParam Long ordenId,
            @RequestParam Long platilloId,
            @RequestParam Integer cantidad,
            @RequestParam(required = false) String nota
    ) {
        return toDTO(service.agregarDetalle(ordenId, platilloId, cantidad, nota));
    }

    @GetMapping("/orden/{ordenId}")
    public List<DetalleOrdenDTO> obtenerPorOrden(@PathVariable Long ordenId) {
        return service.obtenerPorOrden(ordenId).stream().map(DetalleOrdenController::toDTO).toList();
    }

    @GetMapping("/pendientes")
    public List<DetalleOrdenDTO> obtenerPendientes() {
        return service.obtenerPendientes().stream().map(DetalleOrdenController::toDTO).toList();
    }

    @PutMapping("/{id}/estado")
    public DetalleOrdenDTO cambiarEstado(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        return toDTO(service.cambiarEstado(id, body.get("estado")));
    }

    private static DetalleOrdenDTO toDTO(DetalleOrden det) {
        Long platilloId = det.getPlatillo() != null ? det.getPlatillo().getId() : null;
        String nombre = det.getPlatillo() != null ? det.getPlatillo().getNombre() : "Platillo eliminado";
        String estado = det.getEstadoPreparacion() != null ? det.getEstadoPreparacion().name() : null;
        return new DetalleOrdenDTO(
                det.getId(),
                platilloId,
                nombre,
                det.getCantidad(),
                det.getPrecioUnitario(),
                det.getNotaCliente(),
                estado
        );
    }
}