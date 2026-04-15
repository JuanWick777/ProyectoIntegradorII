package com.integradora.back.controller.platillo.dto;

import com.integradora.back.model.platillo.Platillo;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class PlatilloResponseDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private BigDecimal precio;
    private String urlImagen;
    private String disponibilidad;
    private Long categoriaId;
    private String categoriaNombre;
    private String estado;

    public static PlatilloResponseDTO from(Platillo p) {
        return PlatilloResponseDTO.builder()
                .id(p.getId())
                .nombre(p.getNombre())
                .descripcion(p.getDescripcion())
                .precio(p.getPrecio())
                .urlImagen(p.getUrlImagen())
                .disponibilidad(p.getEstado())
                .categoriaId(p.getCategoria() != null ? p.getCategoria().getId() : null)
                .categoriaNombre(p.getCategoria() != null ? p.getCategoria().getNombre() : null)
                .estado(p.getEstado())
                .build();
    }
}
