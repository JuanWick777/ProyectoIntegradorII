package com.integradora.back.controller.promocion.dto;

import com.integradora.back.model.promocion.Promocion;

import java.math.BigDecimal;
import java.time.LocalDate;

public class PromocionResponseDTO {
    private Long id;
    private String titulo;
    private String descripcion;
    private String tipoDescuento;
    private BigDecimal valorDescuento;
    private String codigoPromo;
    private Boolean activa;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private Long categoriaId;

    public static PromocionResponseDTO from(Promocion p) {
        PromocionResponseDTO dto = new PromocionResponseDTO();
        dto.id = p.getId();
        dto.titulo = p.getTitulo();
        dto.descripcion = p.getDescripcion();
        dto.tipoDescuento = p.getTipoDescuento();
        dto.valorDescuento = p.getValorDescuento();
        dto.codigoPromo = p.getCodigoPromo();
        dto.activa = p.getActiva();
        dto.fechaInicio = p.getFechaInicio();
        dto.fechaFin = p.getFechaFin();
        dto.categoriaId = p.getCategoriaId();
        return dto;
    }

    public Long getId() { return id; }
    public String getTitulo() { return titulo; }
    public String getDescripcion() { return descripcion; }
    public String getTipoDescuento() { return tipoDescuento; }
    public BigDecimal getValorDescuento() { return valorDescuento; }
    public String getCodigoPromo() { return codigoPromo; }
    public Boolean getActiva() { return activa; }
    public LocalDate getFechaInicio() { return fechaInicio; }
    public LocalDate getFechaFin() { return fechaFin; }
    public Long getCategoriaId() { return categoriaId; }
}

