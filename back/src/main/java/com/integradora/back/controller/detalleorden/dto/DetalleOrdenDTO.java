package com.integradora.back.controller.detalleorden.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DetalleOrdenDTO {
    private Long platilloId;
    private String nombre;
    private Integer cantidad;
    private BigDecimal precio;
    private String nota;
    private String estadoPreparacion;
}
