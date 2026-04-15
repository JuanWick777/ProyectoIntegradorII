package com.integradora.back.controller.usuario.dto;

import com.integradora.back.model.usuario.Usuario;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class UsuarioResponseDTO {

    private Long id;
    private String nombre;
    private String correo;
    private String rol;
    private String fotoPerfil;
    private String estado;
    private LocalDateTime fechaRegistro;
    private List<Long> mesaIds;
    private List<Integer> mesasAsignadas;

    public static UsuarioResponseDTO from(Usuario u) {
        return from(u, List.of(), List.of());
    }

    public static UsuarioResponseDTO from(Usuario u, List<Long> mesaIds, List<Integer> mesasAsignadas) {
        return new UsuarioResponseDTO(
                u.getId(),
                u.getNombreCompleto(),
                u.getCorreo(),
                resolverRol(u),
                u.getFotoPerfil(),
                u.getEstado(),
                u.getFechaRegistro(),
                mesaIds,
                mesasAsignadas
        );
    }

    private static String resolverRol(Usuario u) {
        if (u.getTipoUsuario() != null && u.getTipoUsuario().equalsIgnoreCase("ADMIN")) {
            return "ADMIN";
        }

        if (u.getRolEspecifico() != null) {
            return u.getRolEspecifico().toUpperCase();
        }

        if (u.getTipoUsuario() != null) {
            return u.getTipoUsuario().toUpperCase();
        }

        return "CLIENTE";
    }
}
