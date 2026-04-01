package com.restaurante.api.controller;

import com.restaurante.api.dto.*;
import com.restaurante.api.entity.*;
import com.restaurante.api.repository.*;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * AdminController — CRUD de usuarios de staff.
 * Rutas protegidas con rol ADMIN (configurado en SecurityConfig: /api/admin/**)
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private static final Logger log = LoggerFactory.getLogger(AdminController.class);

    private final UsuarioRepository usuarioRepo;
    private final ProductoRepository productoRepo;
    private final BrigadaRepository brigadaRepo;
    private final MesaRepository mesaRepo;
    private final PasswordEncoder passwordEncoder;

    // ── Generar mesas 1..N ────────────────────────────────────────────────────
    @PostMapping("/mesas/generar")
    public ResponseEntity<?> generarMesas(@RequestParam int hasta) {
        if (hasta < 1 || hasta > 200)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El número debe estar entre 1 y 200");
        List<Integer> creadas = new ArrayList<>();
        for (int n = 1; n <= hasta; n++) {
            int num = n;
            if (mesaRepo.findByNumero(num).isEmpty()) {
                Mesa m = new Mesa();
                m.setNumero(num);
                m.setEstado(Mesa.Estado.libre);
                mesaRepo.save(m);
                creadas.add(num);
            }
        }
        return ResponseEntity.ok(Map.of(
                "creadas", creadas.size(),
                "totalHasta", hasta,
                "mensaje", creadas.isEmpty()
                        ? "Todas las mesas ya existían"
                        : "Generadas " + creadas.size() + " mesas nuevas"));
    }

    // ── CRUD Brigadas ──────────────────────────────────────────────────────
    @GetMapping("/brigadas")
    public List<com.restaurante.api.entity.Brigada> listarBrigadas() {
        return brigadaRepo.findAll();
    }

    @PostMapping("/brigadas")
    public ResponseEntity<com.restaurante.api.entity.Brigada> crearBrigada(
            @RequestBody com.restaurante.api.entity.Brigada req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(brigadaRepo.save(req));
    }

    @PutMapping("/brigadas/{id}")
    public com.restaurante.api.entity.Brigada actualizarBrigada(
            @PathVariable Long id, @RequestBody com.restaurante.api.entity.Brigada req) {
        com.restaurante.api.entity.Brigada b = brigadaRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Brigada no encontrada"));
        b.setNombre(req.getNombre());
        b.setDescripcion(req.getDescripcion());
        b.setMesaDesde(req.getMesaDesde());
        b.setMesaHasta(req.getMesaHasta());
        return brigadaRepo.save(b);
    }

    @DeleteMapping("/brigadas/{id}")
    public ResponseEntity<Void> eliminarBrigada(@PathVariable Long id) {
        brigadaRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ── Listar productos (para el Panel Admin) ────────────────────────────────
    @GetMapping("/productos")
    public List<Map<String, Object>> listarProductos() {
        return productoRepo.findAll().stream().map(p -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", p.getId());
            m.put("nombre", p.getNombre());
            m.put("descripcion", p.getDescripcion() != null ? p.getDescripcion() : "");
            m.put("precio", p.getPrecio());
            m.put("imagen_url", p.getImagenUrl() != null ? p.getImagenUrl() : "");
            m.put("categoria_id", p.getCategoria() != null ? p.getCategoria().getId() : null);
            m.put("categoria", p.getCategoria() != null ? p.getCategoria().getNombre() : "");
            m.put("kitchen_id", p.getKitchenId());
            m.put("stock_disponible", p.getStockDisponible());
            m.put("activo", p.getActivo());
            return m;
        }).toList();
    }

    // ── Crear producto ────────────────────────────────────────────────────────
    @PostMapping("/productos")
    public ResponseEntity<Map<String, Object>> crearProducto(@RequestBody Map<String, Object> req) {
        Producto p = buildProducto(new Producto(), req);
        productoRepo.save(p);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("id", p.getId(), "nombre", p.getNombre()));
    }

    // ── Actualizar producto ───────────────────────────────────────────────────
    @PutMapping("/productos/{id}")
    public Map<String, Object> actualizarProducto(@PathVariable Long id, @RequestBody Map<String, Object> req) {
        Producto p = productoRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado"));
        buildProducto(p, req);
        productoRepo.save(p);
        return Map.of("id", p.getId(), "nombre", p.getNombre());
    }

    // ── Borrado lógico (toggle activo) ────────────────────────────────────────
    @DeleteMapping("/productos/{id}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Long id) {
        Producto p = productoRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado"));
        p.setActivo(false);
        productoRepo.save(p);
        return ResponseEntity.noContent().build();
    }

    private Producto buildProducto(Producto p, Map<String, Object> req) {
        if (req.containsKey("nombre"))        p.setNombre((String) req.get("nombre"));
        if (req.containsKey("descripcion"))   p.setDescripcion((String) req.get("descripcion"));
        if (req.containsKey("precio"))        p.setPrecio(new BigDecimal(req.get("precio").toString()));
        if (req.containsKey("imagen_url"))    p.setImagenUrl((String) req.get("imagen_url"));
        if (req.containsKey("kitchen_id"))    p.setKitchenId(Long.valueOf(req.get("kitchen_id").toString()));
        if (req.containsKey("stock_disponible")) p.setStockDisponible(Integer.valueOf(req.get("stock_disponible").toString()));
        if (req.containsKey("categoria_id")) {
            Long catId = Long.valueOf(req.get("categoria_id").toString());
            Categoria cat = new Categoria(); cat.setId(catId);
            p.setCategoria(cat);
        }
        if (p.getActivo() == null) p.setActivo(true);
        return p;
    }

    // ── Listar todos los usuarios de staff ────────────────────────────────────
    @GetMapping("/usuarios")
    public List<UsuarioResponseDTO> listar() {
        try {
            return usuarioRepo.findAll().stream()
                    .map(UsuarioResponseDTO::from)
                    .toList();
        } catch (Exception e) {
            log.error("[listar] Error al cargar usuarios: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error al cargar usuarios: " + e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    // ── Crear nuevo usuario ───────────────────────────────────────────────────
    @PostMapping("/usuarios")
    public ResponseEntity<UsuarioResponseDTO> crear(@RequestBody UsuarioRequestDTO req) {
        if (usuarioRepo.findByEmail(req.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El email ya está registrado");
        }
        if (req.getPassword() == null || req.getPassword().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La contraseña es requerida");
        }

        Usuario u = new Usuario();
        u.setNombre(req.getNombre());
        u.setEmail(req.getEmail());
        u.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        u.setRol(Usuario.Rol.valueOf(req.getRol()));
        u.setEspecialidad(req.getEspecialidad());
        u.setMesaId(req.getMesaId());
        if (req.getBrigadaId() != null) {
            brigadaRepo.findById(req.getBrigadaId()).ifPresent(u::setBrigada);
        } else {
            u.setBrigada(null);
        }
        u.setActivo(true);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(UsuarioResponseDTO.from(usuarioRepo.save(u)));
    }

    // ── Actualizar usuario (sin cambiar password si no se envía) ──────────────
    @PutMapping("/usuarios/{id}")
    public UsuarioResponseDTO actualizar(@PathVariable Long id, @RequestBody UsuarioRequestDTO req) {
        Usuario u = usuarioRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        u.setNombre(req.getNombre());
        u.setEmail(req.getEmail());
        u.setRol(Usuario.Rol.valueOf(req.getRol()));
        u.setEspecialidad(req.getEspecialidad());
        u.setMesaId(req.getMesaId());
        if (req.getBrigadaId() != null) {
            brigadaRepo.findById(req.getBrigadaId()).ifPresent(u::setBrigada);
        } else {
            u.setBrigada(null);
        }

        if (req.getPassword() != null && !req.getPassword().isBlank()) {
            u.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        }

        return UsuarioResponseDTO.from(usuarioRepo.save(u));
    }

    // ── Eliminar usuario ──────────────────────────────────────────────────────
    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (!usuarioRepo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado");
        }
        usuarioRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
