package com.integradora.back.controller.orden.dto;

import com.integradora.back.controller.detalleorden.dto.DetalleOrdenRequestDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrdenRequestDTO {
    private Long clienteId;

    @NotNull(message = "mesaId es obligatorio")
    private Long mesaId;

    @NotEmpty(message = "detalles no puede estar vacío")
    @Valid
    private List<DetalleOrdenRequestDTO> detalles;

    private Boolean usarPuntos;
}
