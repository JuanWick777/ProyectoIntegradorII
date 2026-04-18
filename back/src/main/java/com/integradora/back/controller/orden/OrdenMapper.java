package com.integradora.back.controller.orden;

import com.integradora.back.controller.detalleorden.dto.DetalleOrdenDTO;
import com.integradora.back.controller.orden.dto.OrdenResponseDTO;
import com.integradora.back.model.detalleorden.DetalleOrden;
import com.integradora.back.model.orden.Orden;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class OrdenMapper {

    public static OrdenResponseDTO toDTO(Orden orden, List<DetalleOrden> detalles) {

        // ── Estado de la orden ────────────────────────────────────────────────
        String estado = (orden.getEstadoPreparacion() != null)
                ? orden.getEstadoPreparacion().name().toLowerCase()
                : "pendiente_confirmacion";

        // ── Número de mesa ────────────────────────────────────────────────────
        Integer mesaNumero = (orden.getMesa() != null) ? orden.getMesa().getNumero() : null;

        // ── Mapear detalles (lista segura contra nulls) ───────────────────────
        List<DetalleOrden> listaDetalles = (detalles != null) ? detalles : new ArrayList<>();

        List<DetalleOrdenDTO> items = listaDetalles.stream()
                .map(det -> {
                    Long platilloId = (det.getPlatillo() != null) ? det.getPlatillo().getId() : null;
                    String nombre = (det.getPlatillo() != null) ? det.getPlatillo().getNombre() : "Platillo eliminado";
                    BigDecimal precio = (det.getPrecioUnitario() != null) ? det.getPrecioUnitario() : BigDecimal.ZERO;
                    String estadoDet = (det.getEstadoPreparacion() != null) ? det.getEstadoPreparacion().name() : "PENDIENTE";

                    return new DetalleOrdenDTO(
                            det.getId(),
                            platilloId,
                            nombre,
                            det.getCantidad(),
                            precio,
                            det.getNotaCliente(),
                            estadoDet
                    );
                })
                .collect(Collectors.toList());

        return new OrdenResponseDTO(
                orden.getId(),
                estado,
                mesaNumero,
                items,
                orden.getSubtotal() != null ? orden.getSubtotal() : BigDecimal.ZERO,
                orden.getMontoDescuento() != null ? orden.getMontoDescuento() : BigDecimal.ZERO,
                orden.getCodigoPromoAplicado(),
                orden.getTotal() != null ? orden.getTotal() : BigDecimal.ZERO,
                orden.getFechaCreacion(),
                orden.getMotivoCancelacion(),
                orden.getCanceladaPor() != null ? orden.getCanceladaPor().getNombreCompleto() : null,
                orden.getFechaCancelacion()
        );
    }
}
