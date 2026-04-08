package com.integradora.back.controller.platillo.dto;

import lombok.Data;
import java.math.BigDecimal;

/** DTO de entrada para crear / actualizar platillos desde el panel admin. */
@Data
public class PlatilloAdminDTO {
    private String nombre;
    private String descripcion;
    private BigDecimal precio;
    private String imagenUrl;   // camelCase → columna url_imagen
    private Integer stock;
    private Long categoriaId;
    private Long kitchenId;     // id de la cocina
}
