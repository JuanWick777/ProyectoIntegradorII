package com.integradora.back.controller.usuario.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "nombreCompleto es obligatorio")
    @Size(min = 2, max = 120, message = "nombreCompleto debe tener entre 2 y 120 caracteres")
    private String nombreCompleto;

    @NotBlank(message = "correo es obligatorio")
    @Email(message = "correo debe ser válido")
    private String correo;

    @NotBlank(message = "contrasena es obligatoria")
    @Size(min = 6, max = 100, message = "contrasena debe tener entre 6 y 100 caracteres")
    private String contrasena;
}
