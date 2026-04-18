package com.integradora.back.service;

import com.integradora.back.model.bitacora.BitacoraSistema;
import com.integradora.back.model.orden.Orden;
import com.integradora.back.model.usuario.Usuario;
import com.integradora.back.repository.BitacoraSistemaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final BitacoraSistemaRepository bitacoraSistemaRepository;

    @Transactional
    public void registrarCambioPasswordEmpleado(Usuario usuario, String contexto) {
        if (!esEmpleado(usuario)) {
            return;
        }

        String nombre = usuario.getNombreCompleto() != null ? usuario.getNombreCompleto() : "Empleado";
        String correo = usuario.getCorreo() != null ? usuario.getCorreo() : "sin-correo";
        String rol = usuario.getRolEspecifico() != null ? usuario.getRolEspecifico() : usuario.getTipoUsuario();

        bitacoraSistemaRepository.save(
                BitacoraSistema.builder()
                        .tablaAfectada("USUARIOS")
                        .accion("CAMBIO_PASSWORD")
                        .usuarioId(usuario.getId())
                        .fecha(LocalDateTime.now())
                        .descripcion(String.format(
                                "Cambio de contrasena de empleado. Contexto=%s, Nombre=%s, Correo=%s, Rol=%s",
                                contexto,
                                nombre,
                                correo,
                                rol != null ? rol : "SIN_ROL"
                        ))
                        .build()
        );
    }

    @Transactional
    public void registrarCancelacionOrden(Orden orden, Usuario usuario, String motivo) {
        if (orden == null || usuario == null) {
            return;
        }

        bitacoraSistemaRepository.save(
                BitacoraSistema.builder()
                        .tablaAfectada("ORDENES")
                        .accion("CANCELACION")
                        .usuarioId(usuario.getId())
                        .fecha(LocalDateTime.now())
                        .descripcion(String.format(
                                "Orden #%s cancelada por %s (%s). Motivo=%s",
                                orden.getId(),
                                usuario.getNombreCompleto() != null ? usuario.getNombreCompleto() : "Usuario",
                                usuario.getCorreo() != null ? usuario.getCorreo() : "sin-correo",
                                motivo != null ? motivo : "SIN_MOTIVO"
                        ))
                        .build()
        );
    }

    private boolean esEmpleado(Usuario usuario) {
        if (usuario == null) {
            return false;
        }

        String tipo = usuario.getTipoUsuario() == null ? "" : usuario.getTipoUsuario().trim().toUpperCase();
        String rol = usuario.getRolEspecifico() == null ? "" : usuario.getRolEspecifico().trim().toUpperCase();

        return !tipo.contains("CLIENTE") && (!tipo.isBlank() || !rol.isBlank());
    }
}
