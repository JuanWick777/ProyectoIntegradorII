package com.integradora.back.controller.usuario.dto;

import com.integradora.back.model.usuario.Usuario;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UsuarioResponseDTO {

    private Long id;
    private String nombre;
    private String correo;
    private String rol;
    private String fotoPerfil;

    public static UsuarioResponseDTO from(Usuario u) {
        return new UsuarioResponseDTO(
                u.getId(),
                u.getNombreCompleto(), // 👈 aquí el fix
                u.getCorreo(),
                resolverRol(u), // 👈 aquí el fix
                u.getFotoPerfil()
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