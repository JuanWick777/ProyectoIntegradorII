package com.integradora.back.controller.categoria.dto;

import com.integradora.back.model.categoria.Categoria;

public class CategoriaResponseDTO {
    private Long id;
    private String nombre;

    public static CategoriaResponseDTO from(Categoria c) {
        CategoriaResponseDTO dto = new CategoriaResponseDTO();
        dto.id = c.getId();
        dto.nombre = c.getNombre();
        return dto;
    }

    public Long getId() { return id; }
    public String getNombre() { return nombre; }
}

