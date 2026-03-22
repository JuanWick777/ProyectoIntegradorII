package com.integradora.back.controller;

import com.integradora.back.controller.dto.LoginRequest;
import com.integradora.back.controller.dto.RegisterRequest;
import com.integradora.back.model.Usuario;
import com.integradora.back.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public Usuario register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public Usuario login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/test")
    public String test() {
        return "Backend funcionando 😎";
    }
}
