package com.integradora.back.controller.detalleorden.dto;

import lombok.Data;

@Data
public class DetalleOrdenDTO {
    private Long platilloId;
    private Integer cantidad;
    private String nota;
}
