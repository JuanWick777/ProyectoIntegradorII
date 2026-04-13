package com.integradora.back.controller.mesa.dto;

import com.integradora.back.model.mesa.Mesa;

public class MesaResponseDTO {
    private Long id;
    private Integer numero;
    private String estado;

    public static MesaResponseDTO from(Mesa m) {
        MesaResponseDTO dto = new MesaResponseDTO();
        dto.id = m.getId();
        dto.numero = m.getNumero();
        dto.estado = m.getEstado();
        return dto;
    }

    public Long getId() { return id; }
    public Integer getNumero() { return numero; }
    public String getEstado() { return estado; }
}

