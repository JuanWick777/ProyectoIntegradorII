package com.integradora.back.controller.orden;

import com.integradora.back.controller.detalleorden.dto.DetalleOrdenDTO;
import com.integradora.back.model.orden.Orden;
import com.integradora.back.model.detalleorden.DetalleOrden;
import com.integradora.back.controller.orden.dto.*;

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
                        det.getNotaCliente(),
                        det.getEstadoPreparacion().name()
                )
        ).collect(Collectors.toList());

        return new OrdenResponseDTO(
                orden.getId(),
                orden.getEstadoPreparacion().name().toLowerCase(),
                orden.getMesa().getNumero(),
                items,
                orden.getSubtotal(),
                orden.getTotal(),
                orden.getFechaCreacion()
        );
    }
}