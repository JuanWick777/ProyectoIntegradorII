package com.integradora.back.controller.promocion.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public class PromocionRequestDTO {

    @NotBlank(message = "titulo es obligatorio")
    @Size(min = 2, max = 120, message = "titulo debe tener entre 2 y 120 caracteres")
    private String titulo;

    @Size(max = 500, message = "descripcion no puede exceder 500 caracteres")
    private String descripcion;

    @NotBlank(message = "tipoDescuento es obligatorio")
    private String tipoDescuento;

    @NotNull(message = "valorDescuento es obligatorio")
    private BigDecimal valorDescuento;

    private String codigoPromo;

    private Boolean activa;

    private LocalDate fechaInicio;

    private LocalDate fechaFin;

    private Long categoriaId;

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public String getTipoDescuento() { return tipoDescuento; }
    public void setTipoDescuento(String tipoDescuento) { this.tipoDescuento = tipoDescuento; }
    public BigDecimal getValorDescuento() { return valorDescuento; }
    public void setValorDescuento(BigDecimal valorDescuento) { this.valorDescuento = valorDescuento; }
    public String getCodigoPromo() { return codigoPromo; }
    public void setCodigoPromo(String codigoPromo) { this.codigoPromo = codigoPromo; }
    public Boolean getActiva() { return activa; }
    public void setActiva(Boolean activa) { this.activa = activa; }
    public LocalDate getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDate fechaInicio) { this.fechaInicio = fechaInicio; }
    public LocalDate getFechaFin() { return fechaFin; }
    public void setFechaFin(LocalDate fechaFin) { this.fechaFin = fechaFin; }
    public Long getCategoriaId() { return categoriaId; }
    public void setCategoriaId(Long categoriaId) { this.categoriaId = categoriaId; }
}

