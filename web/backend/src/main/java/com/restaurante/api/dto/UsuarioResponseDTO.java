package com.restaurante.api.dto;

import com.restaurante.api.entity.Usuario;
import lombok.*;
import java.time.LocalDateTime;

/** DTO de respuesta que omite el password_hash */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioResponseDTO {
    private Long id;
    private String nombre;
    private String email;
    private String rol;
    private String especialidad;
    private Long brigadaId;
    private String brigadaNombre;
    private Integer mesaId;
    private Boolean activo;
    private LocalDateTime createdAt;

    public static UsuarioResponseDTO from(Usuario u) {
        return UsuarioResponseDTO.builder()
                .id(u.getId())
                .nombre(u.getNombre())
                .email(u.getEmail())
                .rol(u.getRol().name())
                .especialidad(u.getEspecialidad())
                .brigadaId(u.getBrigada() != null ? u.getBrigada().getId() : null)
                .brigadaNombre(u.getBrigada() != null ? u.getBrigada().getNombre() : null)
                .mesaId(u.getMesaId())
                .activo(u.getActivo())
                .createdAt(u.getCreatedAt())
                .build();
    }
}
