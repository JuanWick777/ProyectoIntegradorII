package com.integradora.back.controller.orden.dto;

import com.integradora.back.controller.detalleorden.dto.DetalleOrdenDTO;
import lombok.Data;
import java.util.List;

@Data
public class OrdenRequestDTO {
    private Long clienteId;
    private Long mesaId;
    private List<DetalleOrdenDTO> detalles;
}
