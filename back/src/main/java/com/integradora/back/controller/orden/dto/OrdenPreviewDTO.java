package com.integradora.back.controller.orden.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class OrdenPreviewDTO {
    private BigDecimal subtotal;
    private BigDecimal descuentoPromo;
    private BigDecimal descuentoPuntos;
    private BigDecimal montoDescuento;
    private String codigoPromoAplicado;
    private String tituloPromoAplicada;
    private BigDecimal total;
    private Integer puntosGanados;
}
