package com.integradora.back.controller.orden.dto;

import com.integradora.back.controller.detalleorden.dto.DetalleOrdenRequestDTO;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrdenRequestDTO {
    private Long clienteId;
    private Long mesaId;
    private List<DetalleOrdenRequestDTO> detalles;
}
