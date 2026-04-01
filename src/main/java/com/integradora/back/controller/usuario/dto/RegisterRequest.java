package com.integradora.back.controller.usuario.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String nombreCompleto;
    private String correo;
    private String contrasena;
}
