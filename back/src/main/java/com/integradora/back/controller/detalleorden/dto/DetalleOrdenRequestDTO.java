package com.integradora.back.controller.detalleorden.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DetalleOrdenRequestDTO {
    @NotNull(message = "platilloId es obligatorio")
    private Long platilloId;

    @NotNull(message = "cantidad es obligatoria")
    @Min(value = 1, message = "cantidad debe ser al menos 1")
    private Integer cantidad;

    private String nota;
}
