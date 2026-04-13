package com.integradora.back.controller.categoria.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CategoriaRequestDTO {
    @NotBlank(message = "nombre es obligatorio")
    @Size(min = 2, max = 80, message = "nombre debe tener entre 2 y 80 caracteres")
    private String nombre;

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
}

