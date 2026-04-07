package com.integradora.back.service;

import com.integradora.back.controller.usuario.dto.LoginRequest;
import com.integradora.back.controller.usuario.dto.LoginResponseDTO;
import com.integradora.back.controller.usuario.dto.RegisterRequest;
import com.integradora.back.model.usuario.Usuario;
import com.integradora.back.repository.UsuarioRepository;
import com.integradora.back.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public Usuario register(RegisterRequest request) {
        if (usuarioRepository.findByCorreo(request.getCorreo()).isPresent()) {
            throw new RuntimeException("El correo ya está registrado");
        }

        Usuario usuario = Usuario.builder()
                .nombreCompleto(request.getNombreCompleto())
                .correo(request.getCorreo())
                .contrasena(passwordEncoder.encode(request.getContrasena()))
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

    public LoginResponseDTO login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByCorreo(request.getCorreo())
                .orElseThrow(() -> new RuntimeException("Credenciales incorrectas"));

        String raw = request.getContrasena();
        String stored = usuario.getContrasena();

        boolean matches = passwordEncoder.matches(raw, stored) || raw.equals(stored);
        if (!matches) {
            throw new RuntimeException("Credenciales incorrectas");
        }

        if (stored == null || !stored.startsWith("$2")) {
            usuario.setContrasena(passwordEncoder.encode(raw));
            usuario = usuarioRepository.save(usuario);
        }

        String rol = normalizarRol(usuario);
        String token = jwtService.generateToken(usuario.getCorreo(), rol, usuario.getId());

        return LoginResponseDTO.builder()
                .id(usuario.getId())
                .nombre(usuario.getNombreCompleto())
                .correo(usuario.getCorreo())
                .rol(rol)
                .token(token)
                .build();
    }

    public Usuario obtenerPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public Usuario obtenerPorCorreo(String correo) {
        return usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public LoginResponseDTO toLoginResponse(Usuario usuario) {
        return LoginResponseDTO.builder()
                .id(usuario.getId())
                .nombre(usuario.getNombreCompleto())
                .correo(usuario.getCorreo())
                .rol(normalizarRol(usuario))
                .token(null)
                .build();
    }

    private String normalizarRol(Usuario usuario) {
        String tipo = usuario.getTipoUsuario() == null ? "" : usuario.getTipoUsuario().trim().toUpperCase();
        String especifico = usuario.getRolEspecifico() == null ? "" : usuario.getRolEspecifico().trim().toUpperCase();

        if (tipo.contains("ADMIN")) return "ADMIN";
        if (tipo.contains("CLIENTE")) return "CLIENTE";

        if (especifico.contains("SUPERUSER")) return "ADMIN";
        if (especifico.contains("MESERO")) return "MESERO";
        if (especifico.contains("COCINERO")) return "COCINERO";
        if (especifico.contains("CHEF")) return "CHEF";
        if (especifico.contains("BARISTA")) return "BARISTA";
        if (especifico.contains("REPOST")) return "REPOSTERO";

        if (tipo.contains("EMPLEADO")) return "EMPLEADO";

        return "CLIENTE";
    }
}