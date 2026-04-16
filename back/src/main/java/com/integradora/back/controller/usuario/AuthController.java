package com.integradora.back.controller.usuario;

import com.integradora.back.controller.usuario.dto.DeleteAccountRequestDTO;
import com.integradora.back.controller.usuario.dto.ForgotPasswordRequest;
import com.integradora.back.controller.usuario.dto.LoginRequest;
import com.integradora.back.controller.usuario.dto.LoginResponseDTO;
import com.integradora.back.controller.usuario.dto.RegisterRequest;
import com.integradora.back.controller.usuario.dto.ResetPasswordRequest;
import com.integradora.back.controller.usuario.dto.UpdateProfileRequestDTO;
import com.integradora.back.controller.usuario.dto.UsuarioResponseDTO;
import com.integradora.back.model.usuario.Usuario;
import com.integradora.back.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public UsuarioResponseDTO register(@Valid @RequestBody RegisterRequest request) {
        Usuario usuario = authService.register(request);
        return UsuarioResponseDTO.from(usuario);
    }

    @PostMapping("/login")
    public LoginResponseDTO login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        authService.generarYEnviarCodigo(request.getCorreo());
        return ResponseEntity.ok(Map.of("message", "Si el correo existe, se ha enviado un codigo."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody ResetPasswordRequest request) {
        authService.restablecerContrasena(
                request.getCorreo(),
                request.getCodigo(),
                request.getNuevaContrasena()
        );
        return ResponseEntity.ok(Map.of("message", "Contrasena actualizada exitosamente."));
    }

    @GetMapping("/me")
    public ResponseEntity<LoginResponseDTO> me(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(UNAUTHORIZED, "No autenticado");
        }

        Usuario usuario = authService.obtenerPorCorreo(authentication.getName());
        return ResponseEntity.ok(authService.toLoginResponse(usuario));
    }

    @PutMapping("/perfil")
    public ResponseEntity<LoginResponseDTO> actualizarPerfil(
            Authentication authentication,
            @RequestBody UpdateProfileRequestDTO body
    ) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(UNAUTHORIZED, "No autenticado");
        }

        LoginResponseDTO response = authService.actualizarPerfil(
                authentication.getName(),
                body.getNombre(),
                body.getCorreo(),
                body.getContrasena(),
                body.getContrasenaActual(),
                body.getFotoPerfil()
        );
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/eliminar-cuenta")
    public ResponseEntity<Map<String, String>> eliminarCuenta(
            Authentication authentication,
            @RequestBody DeleteAccountRequestDTO body
    ) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(UNAUTHORIZED, "No autenticado");
        }

        authService.eliminarCuenta(authentication.getName(), body.getContrasenaActual());
        return ResponseEntity.ok(Map.of("message", "Cuenta eliminada correctamente"));
    }
}
