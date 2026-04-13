package com.integradora.back.controller.platillo.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

/** DTO de entrada para crear / actualizar platillos desde el panel admin. */
@Data
public class PlatilloAdminDTO {
    @NotBlank(message = "nombre es obligatorio")
    private String nombre;
    private String descripcion;

    @NotNull(message = "precio es obligatorio")
    @DecimalMin(value = "0.01", inclusive = true, message = "precio debe ser mayor a 0")
    private BigDecimal precio;
    private String imagenUrl;   // camelCase → columna url_imagen
    private String disponibilidad;
    private Long categoriaId;
    private Long kitchenId;     // id de la cocina
}
