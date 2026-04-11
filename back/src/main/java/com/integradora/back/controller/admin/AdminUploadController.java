package com.integradora.back.controller.admin;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/uploads")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AdminUploadController {

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/png",
            "image/jpeg",
            "image/webp",
            "image/gif"
    );

    @PostMapping("/platillos")
    public ResponseEntity<?> uploadPlatilloImage(@RequestParam("file") MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Archivo vacío"));
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
                    .body(Map.of("error", "Tipo de archivo no permitido"));
        }

        String originalName = StringUtils.cleanPath(file.getOriginalFilename() == null ? "imagen" : file.getOriginalFilename());
        String ext = "";
        int dot = originalName.lastIndexOf('.');
        if (dot >= 0 && dot < originalName.length() - 1) {
            ext = originalName.substring(dot).toLowerCase();
        }

        Path dir = Paths.get("uploads", "platillos").toAbsolutePath().normalize();
        Files.createDirectories(dir);

        String filename = UUID.randomUUID() + ext;
        Path target = dir.resolve(filename).normalize();
        Files.copy(file.getInputStream(), target);

        String publicPath = "/uploads/platillos/" + filename;
        String publicUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path(publicPath)
                .toUriString();

        return ResponseEntity.ok(Map.of(
                "url", publicUrl,
                "path", publicPath,
                "filename", filename
        ));
    }

    @DeleteMapping("/platillos")
    public ResponseEntity<?> deletePlatilloImage(@RequestParam("path") String pathOrUrl) throws IOException {
        if (pathOrUrl == null || pathOrUrl.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "path requerido"));
        }

        String path = pathOrUrl.trim();
        if (path.startsWith("http://") || path.startsWith("https://")) {
            try {
                URI uri = new URI(path);
                path = uri.getPath();
            } catch (URISyntaxException e) {
                return ResponseEntity.badRequest().body(Map.of("error", "URL inválida"));
            }
        }

        if (!path.startsWith("/uploads/platillos/")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Ruta no permitida"));
        }

        String filename = path.substring("/uploads/platillos/".length());
        if (filename.isBlank() || filename.contains("..") || filename.contains("/") || filename.contains("\\")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Nombre de archivo inválido"));
        }

        Path dir = Paths.get("uploads", "platillos").toAbsolutePath().normalize();
        Path target = dir.resolve(filename).normalize();
        if (!target.startsWith(dir)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Ruta inválida"));
        }

        Files.deleteIfExists(target);
        return ResponseEntity.noContent().build();
    }
}

