package com.integradora.back.service;

import com.integradora.back.controller.dto.LoginRequest;
import com.integradora.back.controller.dto.RegisterRequest;
import com.integradora.back.model.Usuario;
import com.integradora.back.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;

    public Usuario register(RegisterRequest request) {

        if (usuarioRepository.findByCorreo(request.getCorreo()).isPresent()) {
            throw new RuntimeException("El correo ya está registrado");
        }

        Usuario usuario = Usuario.builder()
                .nombreCompleto(request.getNombreCompleto())
                .correo(request.getCorreo())
                .contrasena(request.getContrasena())
                .telefono(null)
                .tipoUsuario("Cliente")
                .rolEspecifico(null)
                .areaAsignada(null)
                .puntosLealtad(0)
                .turno(null)
                .estado("Activo")
                .fechaRegistro(null)
                .build();

        return usuarioRepository.save(usuario);
    }

    public Usuario login(LoginRequest request) {

        return usuarioRepository
                .findByCorreoAndContrasena(
                        request.getCorreo(),
                        request.getContrasena()
                )
                .orElseThrow(() -> new RuntimeException("Credenciales incorrectas"));
    }
}
