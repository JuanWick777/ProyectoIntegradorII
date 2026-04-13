package com.integradora.back.controller.cocina.dto;

import com.integradora.back.model.detalleorden.DetalleOrden;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO para endpoints de cocina que mantiene compatibilidad con el frontend:
 * - Incluye objetos anidados orden/mesa y platillo con los campos mínimos.
 * - Evita exponer entidades JPA completas.
 */
public class DetalleOrdenKitchenDTO {
    private Long id;
    private Integer cantidad;
    private BigDecimal precioUnitario;
    private BigDecimal subtotal;
    private String notaCliente;
    private String estadoPreparacion;
    private OrdenRef orden;
    private PlatilloRef platillo;

    public static DetalleOrdenKitchenDTO from(DetalleOrden d) {
        DetalleOrdenKitchenDTO dto = new DetalleOrdenKitchenDTO();
        dto.id = d.getId();
        dto.cantidad = d.getCantidad();
        dto.precioUnitario = d.getPrecioUnitario();
        dto.subtotal = d.getSubtotal();
        dto.notaCliente = d.getNotaCliente();
        dto.estadoPreparacion = d.getEstadoPreparacion() != null ? d.getEstadoPreparacion().name() : null;

        if (d.getOrden() != null) {
            Integer mesaNumero = (d.getOrden().getMesa() != null) ? d.getOrden().getMesa().getNumero() : null;
            dto.orden = new OrdenRef(d.getOrden().getId(), d.getOrden().getFechaCreacion(), new MesaRef(mesaNumero));
        }

        if (d.getPlatillo() != null) {
            dto.platillo = new PlatilloRef(d.getPlatillo().getId(), d.getPlatillo().getNombre());
        }

        return dto;
    }

    public Long getId() { return id; }
    public Integer getCantidad() { return cantidad; }
    public BigDecimal getPrecioUnitario() { return precioUnitario; }
    public BigDecimal getSubtotal() { return subtotal; }
    public String getNotaCliente() { return notaCliente; }
    public String getEstadoPreparacion() { return estadoPreparacion; }
    public OrdenRef getOrden() { return orden; }
    public PlatilloRef getPlatillo() { return platillo; }

    public record MesaRef(Integer numero) {}

    public record OrdenRef(Long id, LocalDateTime fechaCreacion, MesaRef mesa) {}

    public record PlatilloRef(Long id, String nombre) {}
}

