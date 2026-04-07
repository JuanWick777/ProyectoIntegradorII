package com.integradora.back.controller.orden.dto;

import com.integradora.back.controller.detalleorden.dto.DetalleOrdenDTO;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class OrdenResponseDTO {

    private Long id;
    private String estado;
    private Integer mesaNumero;

    private List<DetalleOrdenDTO> items;

    private BigDecimal subtotal;
    private BigDecimal total;

    private LocalDateTime fechaCreacion;
}