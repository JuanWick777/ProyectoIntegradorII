package com.integradora.back.service;

import com.integradora.back.model.usuario.Usuario;
import com.integradora.back.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class LoginAttemptService {

    private static final int MAX_INTENTOS = 3;
    private static final Duration BLOQUEO = Duration.ofMinutes(15);

    private final UsuarioRepository usuarioRepository;

    public void validarAccesoPermitido(Usuario usuario) {
        if (usuario == null) {
            return;
        }

        LocalDateTime bloqueoHasta = usuario.getBloqueoHasta();
        if (bloqueoHasta == null) {
            return;
        }

        if (bloqueoHasta.isAfter(LocalDateTime.now())) {
            long minutosRestantes = Math.max(1, Duration.between(LocalDateTime.now(), bloqueoHasta).toMinutes());
            throw new RuntimeException("Cuenta bloqueada temporalmente por demasiados intentos fallidos. Intenta de nuevo en " + minutosRestantes + " minuto(s).");
        }

        reiniciarIntentos(usuario);
    }

    @Transactional
    public String registrarIntentoFallido(Usuario usuario) {
        if (usuario == null) {
            return "Credenciales incorrectas";
        }

        int intentosActuales = usuario.getIntentosFallidos() != null ? usuario.getIntentosFallidos() : 0;
        int nuevosIntentos = intentosActuales + 1;

        usuario.setIntentosFallidos(nuevosIntentos);
        usuario.setUltimoIntentoFallido(LocalDateTime.now());

        if (nuevosIntentos >= MAX_INTENTOS) {
            usuario.setBloqueoHasta(LocalDateTime.now().plus(BLOQUEO));
            usuarioRepository.save(usuario);
            return "Cuenta bloqueada temporalmente por demasiados intentos fallidos. Intenta de nuevo en 15 minutos.";
        }

        usuarioRepository.save(usuario);
        int restantes = MAX_INTENTOS - nuevosIntentos;
        return "Credenciales incorrectas. Intentos restantes antes del bloqueo: " + restantes;
    }

    @Transactional
    public void limpiarIntentos(Usuario usuario) {
        if (usuario == null) {
            return;
        }

        reiniciarIntentos(usuario);
    }

    private void reiniciarIntentos(Usuario usuario) {
        boolean huboCambios = (usuario.getIntentosFallidos() != null && usuario.getIntentosFallidos() > 0)
                || usuario.getBloqueoHasta() != null
                || usuario.getUltimoIntentoFallido() != null;

        usuario.setIntentosFallidos(0);
        usuario.setBloqueoHasta(null);
        usuario.setUltimoIntentoFallido(null);

        if (huboCambios) {
            usuarioRepository.save(usuario);
        }
    }
}
