package com.integradora.back.controller.detalleorden.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DetalleOrdenRequestDTO {
    private Long platilloId;
    private Integer cantidad;
    private String nota;
}
