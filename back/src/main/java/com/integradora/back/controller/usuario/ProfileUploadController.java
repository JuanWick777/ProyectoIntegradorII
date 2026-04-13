package com.integradora.back.controller.usuario;

import com.integradora.back.model.usuario.Usuario;
import com.integradora.back.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class ProfileUploadController {

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/png",
            "image/jpeg",
            "image/webp",
            "image/gif"
    );

    private final UsuarioRepository usuarioRepository;

    @PostMapping("/foto-perfil")
    public ResponseEntity<?> uploadProfilePhoto(
            Authentication authentication,
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "No autenticado"));
        }

        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Archivo vacío"));
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
                    .body(Map.of("error", "Tipo de archivo no permitido"));
        }

        Usuario usuario = usuarioRepository.findByCorreo(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String originalName = StringUtils.cleanPath(
                file.getOriginalFilename() == null ? "perfil" : file.getOriginalFilename()
        );

        String ext = "";
        int dot = originalName.lastIndexOf('.');
        if (dot >= 0 && dot < originalName.length() - 1) {
            ext = originalName.substring(dot).toLowerCase();
        }

        Path dir = Paths.get("uploads", "perfiles").toAbsolutePath().normalize();
        Files.createDirectories(dir);

        String filename = UUID.randomUUID() + ext;
        Path target = dir.resolve(filename).normalize();
        Files.copy(file.getInputStream(), target);

        String publicPath = "/uploads/perfiles/" + filename;

        usuario.setFotoPerfil(publicPath);
        usuarioRepository.save(usuario);

        String publicUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path(publicPath)
                .toUriString();

        return ResponseEntity.ok(Map.of(
                "url", publicUrl,
                "path", publicPath,
                "filename", filename
        ));
    }
}