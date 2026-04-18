package com.integradora.back.controller.mesa.dto;

import com.integradora.back.model.mesa.Mesa;

public class MesaResponseDTO {
    private Long id;
    private Integer numero;
    private Integer capacidad;
    private String estado;
    private boolean cuentaAbierta;
    private boolean qrActivo;
    private Long ordenActivaId;

    public static MesaResponseDTO from(Mesa m) {
        MesaResponseDTO dto = new MesaResponseDTO();
        dto.id = m.getId();
        dto.numero = m.getNumero();
        dto.capacidad = m.getCapacidad();
        dto.estado = m.getEstado();
        dto.cuentaAbierta = m.getCuentaAbierta() != null && m.getCuentaAbierta() == 1;
        dto.qrActivo = m.getQrActivo() == null || m.getQrActivo() == 1;
        dto.ordenActivaId = m.getOrdenActiva() != null ? m.getOrdenActiva().getId() : null;
        return dto;
    }

    public Long getId() { return id; }
    public Integer getNumero() { return numero; }
    public Integer getCapacidad() { return capacidad; }
    public String getEstado() { return estado; }
    public boolean isCuentaAbierta() { return cuentaAbierta; }
    public boolean isQrActivo() { return qrActivo; }
    public Long getOrdenActivaId() { return ordenActivaId; }
}

