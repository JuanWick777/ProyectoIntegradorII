package com.restaurante.api.dto;

import lombok.*;

/** DTO para crear/actualizar un usuario de staff */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioRequestDTO {
    private String nombre;
    private String email;
    private String password;
    private String rol;
    private String especialidad;
    private Long brigadaId;
    private Integer mesaId;
}
