package com.integradora.back.controller.usuario;

import com.integradora.back.controller.usuario.dto.LoginRequest;
import com.integradora.back.controller.usuario.dto.LoginResponseDTO;
import com.integradora.back.controller.usuario.dto.RegisterRequest;
import com.integradora.back.model.usuario.Usuario;
import com.integradora.back.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public Usuario register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @GetMapping("/test")
    public String test() {
        return "Backend jalando al 100 papu";
    }

    @PostMapping("/login")
    public LoginResponseDTO login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "No autenticado"));
        }

        Usuario usuario = authService.obtenerPorCorreo(authentication.getName());
        return ResponseEntity.ok(authService.toLoginResponse(usuario));
    }

    @PutMapping("/perfil")
    public ResponseEntity<?> actualizarPerfil(
            Authentication authentication,
            @RequestBody Map<String, String> body
    ) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "No autenticado"));
        }
        try {
            LoginResponseDTO response = authService.actualizarPerfil(
                    authentication.getName(),
                    body.get("nombre"),
                    body.get("correo"),
                    body.get("contrasena")
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}