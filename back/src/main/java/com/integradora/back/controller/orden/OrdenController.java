package com.integradora.back.controller.orden;

import com.integradora.back.controller.orden.dto.OrdenPreviewDTO;
import com.integradora.back.controller.orden.dto.OrdenRequestDTO;
import com.integradora.back.controller.orden.dto.OrdenResponseDTO;
import com.integradora.back.model.orden.Orden;
import com.integradora.back.repository.DetalleOrdenRepository;
import com.integradora.back.service.OrdenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ordenes")
@RequiredArgsConstructor
public class OrdenController {

    private final OrdenService service;
    private final DetalleOrdenRepository detalleOrdenRepository;

    // ── Crear orden simple (solo ids, sin detalles) ───────────────────────────
    @PostMapping
    public OrdenResponseDTO crear(
            @RequestParam Long clienteId,
            @RequestParam Long mesaId) {
        Orden orden = service.crear(clienteId, mesaId);
        return OrdenMapper.toDTO(orden, detalleOrdenRepository.findByOrdenId(orden.getId()));
    }

    // ── Listar todas ─────────────────────────────────────────────────────────
    @GetMapping
    public List<OrdenResponseDTO> listar() {
        return service.listar().stream()
                .map(o -> OrdenMapper.toDTO(o, detalleOrdenRepository.findByOrdenId(o.getId())))
                .toList();
    }

    // ── Órdenes activas (para el mesero) ──────────────────────────────────────
    @GetMapping("/activas")
    public List<OrdenResponseDTO> obtenerActivas() {
        return service.obtenerActivas().stream()
                .map(o -> OrdenMapper.toDTO(o, detalleOrdenRepository.findByOrdenId(o.getId())))
                .toList();
    }

    // ── Órdenes por cliente ───────────────────────────────────────────────────
    @GetMapping("/cliente/{clienteId}")
    public List<OrdenResponseDTO> porCliente(@PathVariable Long clienteId) {
        return service.porCliente(clienteId).stream()
                .map(o -> OrdenMapper.toDTO(o, detalleOrdenRepository.findByOrdenId(o.getId())))
                .toList();
    }

    // ── Historial ─────────────────────────────────────────────────────────────
    @GetMapping("/historial")
    public List<OrdenResponseDTO> historial() {
        return service.historial().stream()
                .map(o -> OrdenMapper.toDTO(o, detalleOrdenRepository.findByOrdenId(o.getId())))
                .toList();
    }

    // ── Obtener orden por ID (usado por el OrderTracker del cliente) ──────────
    @GetMapping("/{id}")
    public ResponseEntity<OrdenResponseDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.obtenerPorId(id));
    }

    // ── Actualizar estado (mesero/cocina) ─────────────────────────────────────
    @PutMapping("/{id}/estado")
    public OrdenResponseDTO actualizarEstado(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        Orden orden = service.actualizarEstado(id, body.get("estado"));
        return OrdenMapper.toDTO(orden, detalleOrdenRepository.findByOrdenId(orden.getId()));
    }

    // ── Crear orden completa con detalles (cliente → POST /ordenes/completa) ──
    @PostMapping("/completa")
    public OrdenResponseDTO crearCompleta(@Valid @RequestBody OrdenRequestDTO request) {
        return service.crearOrdenCompleta(request);
    }

    @GetMapping("/mis-ordenes")
    public ResponseEntity<List<OrdenResponseDTO>> misOrdenes(Authentication authentication) {
        return ResponseEntity.ok(service.obtenerOrdenesDelClienteActual(authentication));
    }

    @PostMapping("/preview")
    public ResponseEntity<OrdenPreviewDTO> preview(@Valid @RequestBody OrdenRequestDTO request) {
        return ResponseEntity.ok(service.previsualizarOrden(request));
    }


}