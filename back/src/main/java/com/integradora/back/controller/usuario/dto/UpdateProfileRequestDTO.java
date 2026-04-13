package com.integradora.back.controller.usuario.dto;

import lombok.Data;

@Data
public class UpdateProfileRequestDTO {
    private String nombre;
    private String correo;
    private String contrasena;
    private String contrasenaActual;
    private String fotoPerfil;
}