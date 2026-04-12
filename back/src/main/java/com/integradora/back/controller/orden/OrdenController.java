package com.integradora.back.controller.orden;

import com.integradora.back.controller.orden.dto.OrdenPreviewDTO;
import com.integradora.back.controller.orden.dto.OrdenRequestDTO;
import com.integradora.back.controller.orden.dto.OrdenResponseDTO;
import com.integradora.back.model.orden.Orden;
import com.integradora.back.service.OrdenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ordenes")
@RequiredArgsConstructor
public class OrdenController {

    private final OrdenService service;

    // ── Crear orden simple (solo ids, sin detalles) ───────────────────────────
    @PostMapping
    public Orden crear(
            @RequestParam Long clienteId,
            @RequestParam Long mesaId) {
        return service.crear(clienteId, mesaId);
    }

    // ── Listar todas ─────────────────────────────────────────────────────────
    @GetMapping
    public List<Orden> listar() {
        return service.listar();
    }

    // ── Órdenes activas (para el mesero) ──────────────────────────────────────
    @GetMapping("/activas")
    public List<Orden> obtenerActivas() {
        return service.obtenerActivas();
    }

    // ── Órdenes por cliente ───────────────────────────────────────────────────
    @GetMapping("/cliente/{clienteId}")
    public List<Orden> porCliente(@PathVariable Long clienteId) {
        return service.porCliente(clienteId);
    }

    // ── Historial ─────────────────────────────────────────────────────────────
    @GetMapping("/historial")
    public List<Orden> historial() {
        return service.historial();
    }

    // ── Obtener orden por ID (usado por el OrderTracker del cliente) ──────────
    @GetMapping("/{id}")
    public ResponseEntity<OrdenResponseDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.obtenerPorId(id));
    }

    // ── Actualizar estado (mesero/cocina) ─────────────────────────────────────
    @PutMapping("/{id}/estado")
    public Orden actualizarEstado(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        return service.actualizarEstado(id, body.get("estado"));
    }

    // ── Crear orden completa con detalles (cliente → POST /ordenes/completa) ──
    @PostMapping("/completa")
    public OrdenResponseDTO crearCompleta(@RequestBody OrdenRequestDTO request) {
        return service.crearOrdenCompleta(request);
    }

    @GetMapping("/mis-ordenes")
    public ResponseEntity<List<OrdenResponseDTO>> misOrdenes(Authentication authentication) {
        return ResponseEntity.ok(service.obtenerOrdenesDelClienteActual(authentication));
    }

    @PostMapping("/preview")
    public ResponseEntity<OrdenPreviewDTO> preview(@RequestBody OrdenRequestDTO request) {
        return ResponseEntity.ok(service.previsualizarOrden(request));
    }


}