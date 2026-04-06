package com.integradora.back.controller.orden;

import com.integradora.back.controller.detalleorden.dto.DetalleOrdenDTO;
import com.integradora.back.model.orden.Orden;
import com.integradora.back.model.detalleorden.DetalleOrden;
import com.integradora.back.controller.orden.dto.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

public class OrdenMapper {

    public static OrdenResponseDTO toDTO(Orden orden, List<DetalleOrden> detalles) {

        List<DetalleOrdenDTO> items = detalles.stream().map(det ->
                new DetalleOrdenDTO(
                        det.getPlatillo().getId(),
                        det.getPlatillo().getNombre(),
                        det.getCantidad(),
                        det.getPrecioUnitario(),
                        det.getNotaCliente()
                )
        ).collect(Collectors.toList());

        BigDecimal total = detalles.stream()
                .map(DetalleOrden::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new OrdenResponseDTO(
                orden.getId(),
                orden.getEstadoPreparacion().name().toLowerCase(), // 👈 clave
                orden.getMesa().getNumero(),
                items,
                total
        );
    }
}
