package com.integradora.back.controller.usuario;

import com.integradora.back.controller.usuario.dto.*;
import com.integradora.back.model.usuario.Usuario;
import com.integradora.back.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.Map;

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

    @GetMapping("/test")
    public String test() {
        return "Backend jalando al 100 papu";
    }

    @PostMapping("/login")
    public LoginResponseDTO login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "No autenticado"));
        }

        try {
            Usuario usuario = authService.obtenerPorCorreo(authentication.getName());
            return ResponseEntity.ok(authService.toLoginResponse(usuario));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Sesión inválida o usuario no encontrado"));
        }
    }

    @PutMapping("/perfil")
    public ResponseEntity<?> actualizarPerfil(
            Authentication authentication,
            @RequestBody UpdateProfileRequestDTO body
    ) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "No autenticado"));
        }
        try {
            LoginResponseDTO response = authService.actualizarPerfil(
                    authentication.getName(),
                    body.getNombre(),
                    body.getCorreo(),
                    body.getContrasena(),
                    body.getContrasenaActual(),
                    body.getFotoPerfil()
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/eliminar-cuenta")
    public ResponseEntity<?> eliminarCuenta(
            Authentication authentication,
            @RequestBody DeleteAccountRequestDTO body
    ) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "No autenticado"));
        }

        try {
            authService.eliminarCuenta(authentication.getName(), body.getContrasenaActual());
            return ResponseEntity.ok(Map.of("message", "Cuenta eliminada correctamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}