package com.integradora.back.controller.orden.dto;

import lombok.Data;

@Data
public class ActualizarEstadoOrdenRequest {
    private String estado;
    private String motivo;
    private Boolean confirmarCancelacionCocina;
}
