package com.integradora.back.controller.platillo.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PlatilloAdminDTO {
    @NotBlank(message = "nombre es obligatorio")
    private String nombre;

    private String descripcion;

    @NotNull(message = "precio es obligatorio")
    @DecimalMin(value = "0.01", inclusive = true, message = "precio debe ser mayor a 0")
    private BigDecimal precio;

    private String imagenUrl;
    private String estado;

    // Compatibilidad temporal con frontend/móvil que todavía manda "disponibilidad".
    private String disponibilidad;

    private Long categoriaId;
}
