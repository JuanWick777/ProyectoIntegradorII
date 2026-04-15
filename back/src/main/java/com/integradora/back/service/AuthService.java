package com.integradora.back.service;

import com.integradora.back.controller.usuario.dto.LoginRequest;
import com.integradora.back.controller.usuario.dto.LoginResponseDTO;
import com.integradora.back.controller.usuario.dto.RegisterRequest;
import com.integradora.back.model.orden.EstadoOrden;
import com.integradora.back.model.usuario.Usuario;
import com.integradora.back.repository.OrdenRepository;
import com.integradora.back.repository.UsuarioRepository;
import com.integradora.back.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final OrdenRepository ordenRepository;

    @Transactional
    public Usuario register(RegisterRequest request) {
        if (usuarioRepository.findByCorreo(request.getCorreo()).isPresent()) {
            throw new RuntimeException("El correo ya está registrado");
        }

        Usuario usuario = Usuario.builder()
                .nombreCompleto(request.getNombreCompleto())
                .correo(request.getCorreo())
                .contrasena(passwordEncoder.encode(request.getContrasena()))
                .tipoUsuario("Cliente")
                .rolEspecifico(null)
                .puntosLealtad(0)
                .estado("ACTIVO")
                .fechaRegistro(null)
                .build();

        return usuarioRepository.save(usuario);
    }

    @Transactional(readOnly = true)
    public LoginResponseDTO login(LoginRequest request) {

        Usuario usuario = usuarioRepository.findByCorreo(request.getCorreo())
                .orElseThrow(() -> new RuntimeException("Credenciales incorrectas"));

        if ("ELIMINADO".equalsIgnoreCase(usuario.getEstado()) ||
                "INACTIVO".equalsIgnoreCase(usuario.getEstado())) {
            throw new RuntimeException("Esta cuenta ya no está disponible");
        }

        String raw = request.getContrasena();
        String stored = usuario.getContrasena();

        if (!passwordMatches(raw, stored)) {
            throw new RuntimeException("Credenciales incorrectas");
        }

        if (!isBcryptHash(stored)) {
            usuario.setContrasena(passwordEncoder.encode(raw));
            usuarioRepository.save(usuario);
        }

        String rol = normalizarRol(usuario);
        String token = jwtService.generateToken(usuario.getCorreo(), rol, usuario.getId());

        return LoginResponseDTO.builder()
                .id(usuario.getId())
                .nombre(usuario.getNombreCompleto())
                .correo(usuario.getCorreo())
                .rol(rol)
                .puntosLealtad(usuario.getPuntosLealtad())
                .fotoPerfil(usuario.getFotoPerfil())
                .token(token)
                .build();
    }

    @Transactional(readOnly = true)
    public Usuario obtenerPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    @Transactional(readOnly = true)
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
                .puntosLealtad(usuario.getPuntosLealtad())
                .fotoPerfil(usuario.getFotoPerfil())
                .token(null)
                .build();
    }

    @Transactional
    public LoginResponseDTO actualizarPerfil(
            String correoActual,
            String nombre,
            String nuevoCorreo,
            String contrasena,
            String contrasenaActual,
            String fotoPerfil
    ) {
        Usuario usuario = usuarioRepository.findByCorreo(correoActual)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (nombre != null && !nombre.isBlank()) {
            usuario.setNombreCompleto(nombre.trim());
        }

        boolean correoCambio = nuevoCorreo != null
                && !nuevoCorreo.isBlank()
                && !nuevoCorreo.trim().equalsIgnoreCase(correoActual);

        if (correoCambio) {
            if (contrasenaActual == null || contrasenaActual.isBlank()) {
                throw new RuntimeException("Debes ingresar tu contraseña actual para cambiar el correo");
            }

            if (!passwordEncoder.matches(contrasenaActual, usuario.getContrasena())) {
                throw new RuntimeException("La contraseña actual es incorrecta");
            }

            if (usuarioRepository.findByCorreo(nuevoCorreo.trim()).isPresent()) {
                throw new RuntimeException("El correo ya está en uso por otro usuario");
            }

            usuario.setCorreo(nuevoCorreo.trim());
        }

        if (contrasena != null && !contrasena.isBlank()) {
            if (contrasena.length() < 6) {
                throw new RuntimeException("La contraseña debe tener al menos 6 caracteres");
            }
            usuario.setContrasena(passwordEncoder.encode(contrasena));
        }

        if (fotoPerfil != null && !fotoPerfil.isBlank()) {
            usuario.setFotoPerfil(fotoPerfil.trim());
        }

        usuario = usuarioRepository.save(usuario);

        String rol = normalizarRol(usuario);
        String token = jwtService.generateToken(usuario.getCorreo(), rol, usuario.getId());

        return LoginResponseDTO.builder()
                .id(usuario.getId())
                .nombre(usuario.getNombreCompleto())
                .correo(usuario.getCorreo())
                .rol(rol)
                .puntosLealtad(usuario.getPuntosLealtad())
                .fotoPerfil(usuario.getFotoPerfil())
                .token(token)
                .build();
    }

    @Transactional
    public void eliminarCuenta(String correoActual, String contrasenaActual) {
        Usuario usuario = usuarioRepository.findByCorreo(correoActual)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (contrasenaActual == null || contrasenaActual.isBlank()) {
            throw new RuntimeException("Debes ingresar tu contraseña actual");
        }

        if (!passwordEncoder.matches(contrasenaActual, usuario.getContrasena())) {
            throw new RuntimeException("La contraseña actual es incorrecta");
        }

        long ordenesActivas = ordenRepository.countByClienteIdAndEstadoPreparacionIn(
                usuario.getId(),
                List.of(
                        EstadoOrden.PENDIENTE_CONFIRMACION,
                        EstadoOrden.CONFIRMADA,
                        EstadoOrden.EN_PREPARACION,
                        EstadoOrden.LISTA
                )
        );

        if (ordenesActivas > 0) {
            throw new RuntimeException("No puedes eliminar tu cuenta mientras tengas pedidos activos");
        }

        usuario.setEstado("ELIMINADO");
        usuario.setCorreo("cuenta.eliminada." + usuario.getId() + "@gmail.com");
        usuario.setFotoPerfil(null);

        usuarioRepository.save(usuario);
    }

    private String normalizarRol(Usuario usuario) {
        String tipo = usuario.getTipoUsuario() == null ? "" : usuario.getTipoUsuario().trim().toUpperCase();
        String especifico = usuario.getRolEspecifico() == null ? "" : usuario.getRolEspecifico().trim().toUpperCase();

        if (tipo.contains("ADMIN")) return "ADMIN";
        if (tipo.contains("CLIENTE")) return "CLIENTE";

        if (especifico.contains("SUPERUSER") || especifico.contains("ADMIN")) return "ADMIN";
        if (especifico.contains("MESERO")) return "MESERO";
        if (especifico.contains("COCINERO")) return "COCINERO";
        if (especifico.contains("CHEF")) return "CHEF";
        if (especifico.contains("BARISTA")) return "BARISTA";
        if (especifico.contains("REPOST")) return "REPOSTERO";

        if (tipo.contains("EMPLEADO")) return "EMPLEADO";

        return "CLIENTE";
    }

    private boolean passwordMatches(String raw, String stored) {
        if (stored == null) {
            return false;
        }

        if (isBcryptHash(stored)) {
            return passwordEncoder.matches(raw, stored);
        }

        return stored.equals(raw);
    }

    private boolean isBcryptHash(String value) {
        return value != null && (value.startsWith("$2a$") || value.startsWith("$2b$") || value.startsWith("$2y$"));
    }
}
