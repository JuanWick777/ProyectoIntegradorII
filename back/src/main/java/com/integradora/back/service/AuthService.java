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
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final OrdenRepository ordenRepository;
    private final JavaMailSender mailSender;

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

    @Transactional
    public void generarYEnviarCodigo(String correo) {
        if (correo == null || correo.isBlank()) {
            return;
        }

        usuarioRepository.findByCorreo(correo.trim())
                .filter(usuario -> usuario.getEstado() == null || !usuario.getEstado().equalsIgnoreCase("ELIMINADO"))
                .ifPresent(usuario -> {
                    String codigo = String.format("%06d", ThreadLocalRandom.current().nextInt(0, 1_000_000));

                    usuario.setCodigoRecuperacion(codigo);
                    usuario.setExpiracionCodigo(LocalDateTime.now().plusMinutes(10));
                    usuarioRepository.save(usuario);

                    SimpleMailMessage message = new SimpleMailMessage();
                    message.setTo(usuario.getCorreo());
                    message.setSubject("Codigo de recuperacion - App Restaurante");
                    message.setText(
                            "Tu codigo de recuperacion es: " + codigo + "\n" +
                            "Este codigo expirara en 10 minutos."
                    );
                    try {
                        log.info("Enviando codigo de recuperacion a {}", usuario.getCorreo());
                        mailSender.send(message);
                        log.info("Codigo de recuperacion enviado a {}", usuario.getCorreo());
                    } catch (Exception e) {
                        log.error("No se pudo enviar el correo de recuperacion a {}", usuario.getCorreo(), e);
                        throw new RuntimeException("No se pudo enviar el correo de recuperacion. Verifica la configuracion de correo.");
                    }
                });
    }

    @Transactional
    public void restablecerContrasena(String correo, String codigo, String nuevaContrasena) {
        if (correo == null || correo.isBlank()) {
            throw new RuntimeException("El correo es obligatorio");
        }
        if (codigo == null || codigo.isBlank()) {
            throw new RuntimeException("El codigo es obligatorio");
        }
        if (nuevaContrasena == null || nuevaContrasena.isBlank()) {
            throw new RuntimeException("La nueva contrasena es obligatoria");
        }
        if (nuevaContrasena.length() < 8) {
            throw new RuntimeException("La nueva contrasena debe tener al menos 8 caracteres");
        }

        Usuario usuario = usuarioRepository.findByCorreo(correo.trim())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (usuario.getCodigoRecuperacion() == null || !usuario.getCodigoRecuperacion().equals(codigo.trim())) {
            throw new RuntimeException("Codigo invalido");
        }

        if (usuario.getExpiracionCodigo() == null || usuario.getExpiracionCodigo().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("El codigo ha expirado");
        }

        usuario.setContrasena(passwordEncoder.encode(nuevaContrasena));
        usuario.setCodigoRecuperacion(null);
        usuario.setExpiracionCodigo(null);
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
