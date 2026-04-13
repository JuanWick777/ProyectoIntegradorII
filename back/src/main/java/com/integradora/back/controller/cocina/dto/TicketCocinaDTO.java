package com.integradora.back.controller.cocina.dto;

import com.integradora.back.model.detalleorden.DetalleOrden;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TicketCocinaDTO {
    private Long detalleId;
    private Long ordenId;
    private String estadoOrden;
    private Integer mesaNumero;
    private LocalDateTime fechaCreacion;

    private Long platilloId;
    private String platilloNombre;
    private Integer cantidad;
    private BigDecimal precioUnitario;
    private BigDecimal subtotal;
    private String nota;
    private String estadoDetalle;

    public static TicketCocinaDTO from(DetalleOrden d) {
        TicketCocinaDTO dto = new TicketCocinaDTO();
        dto.detalleId = d.getId();

        if (d.getOrden() != null) {
            dto.ordenId = d.getOrden().getId();
            dto.estadoOrden = d.getOrden().getEstadoPreparacion() != null ? d.getOrden().getEstadoPreparacion().name() : null;
            dto.fechaCreacion = d.getOrden().getFechaCreacion();
            dto.mesaNumero = (d.getOrden().getMesa() != null) ? d.getOrden().getMesa().getNumero() : null;
        }

        if (d.getPlatillo() != null) {
            dto.platilloId = d.getPlatillo().getId();
            dto.platilloNombre = d.getPlatillo().getNombre();
        }

        dto.cantidad = d.getCantidad();
        dto.precioUnitario = d.getPrecioUnitario();
        dto.subtotal = d.getSubtotal();
        dto.nota = d.getNotaCliente();
        dto.estadoDetalle = d.getEstadoPreparacion() != null ? d.getEstadoPreparacion().name() : null;
        return dto;
    }

    public Long getDetalleId() { return detalleId; }
    public Long getOrdenId() { return ordenId; }
    public String getEstadoOrden() { return estadoOrden; }
    public Integer getMesaNumero() { return mesaNumero; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public Long getPlatilloId() { return platilloId; }
    public String getPlatilloNombre() { return platilloNombre; }
    public Integer getCantidad() { return cantidad; }
    public BigDecimal getPrecioUnitario() { return precioUnitario; }
    public BigDecimal getSubtotal() { return subtotal; }
    public String getNota() { return nota; }
    public String getEstadoDetalle() { return estadoDetalle; }
}

