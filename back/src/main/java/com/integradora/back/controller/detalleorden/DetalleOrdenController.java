package com.integradora.back.controller.detalleorden;

import com.integradora.back.controller.detalleorden.dto.DetalleOrdenDTO;
import com.integradora.back.model.detalleorden.DetalleOrden;
import com.integradora.back.service.DetalleOrdenService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/detalle-orden")
@RequiredArgsConstructor
public class DetalleOrdenController {

    private final DetalleOrdenService service;

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
