package com.integradora.back.controller.usuario.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "correo es obligatorio")
    @Email(message = "correo debe ser válido")
    private String correo;

    @NotBlank(message = "contrasena es obligatoria")
    private String contrasena;
}
