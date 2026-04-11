package com.integradora.back.controller.usuario.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioRequestDTO {
    private String nombre;
    private String email;
    private String password;
    private String rol;
    private String especialidad;
    private String fotoPerfil;
    private Long mesaId;
}
