package com.integradora.back.controller.detalleorden.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DetalleOrdenDTO {
    private Long id;           // id del DetalleOrden (para cambios de estado desde cocina)
    private Long platilloId;
    private String nombre;
    private Integer cantidad;
    private BigDecimal precioUnitario;
    private String nota;
    private String estadoPreparacion;
}
