package com.integradora.back.controller.usuario.dto;

import lombok.Data;

@Data
public class ResetPasswordRequest {
    private String correo;
    private String codigo;
    private String nuevaContrasena;
}
