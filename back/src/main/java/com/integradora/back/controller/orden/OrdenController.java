package com.integradora.back.controller.orden;

import com.integradora.back.controller.orden.dto.OrdenPreviewDTO;
import com.integradora.back.controller.orden.dto.OrdenRequestDTO;
import com.integradora.back.controller.orden.dto.OrdenResponseDTO;
import com.integradora.back.model.orden.Orden;
import com.integradora.back.repository.DetalleOrdenRepository;
import com.integradora.back.service.OrdenService;
import jakarta.validation.Valid;
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
    private final DetalleOrdenRepository detalleOrdenRepository;

    @GetMapping("/activas")
    public List<OrdenResponseDTO> obtenerActivas() {
        return service.obtenerActivas().stream()
                .map(o -> OrdenMapper.toDTO(o, detalleOrdenRepository.findByOrdenId(o.getId())))
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrdenResponseDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.obtenerPorId(id));
    }

    @GetMapping("/mesa/{numero}/activas")
    public ResponseEntity<List<OrdenResponseDTO>> obtenerActivasPorMesa(@PathVariable Integer numero) {
        return ResponseEntity.ok(service.obtenerActivasPorMesa(numero));
    }

    @PutMapping("/{id}/estado")
    public OrdenResponseDTO actualizarEstado(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        Orden orden = service.actualizarEstado(id, body.get("estado"));
        return OrdenMapper.toDTO(orden, detalleOrdenRepository.findByOrdenId(orden.getId()));
    }

    @PostMapping("/completa")
    public ResponseEntity<?> crearCompleta(@Valid @RequestBody OrdenRequestDTO request) {
        try {
            return ResponseEntity.ok(service.crearOrdenCompleta(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/mis-ordenes")
    public ResponseEntity<List<OrdenResponseDTO>> misOrdenes(Authentication authentication) {
        return ResponseEntity.ok(service.obtenerOrdenesDelClienteActual(authentication));
    }

    @PostMapping("/preview")
    public ResponseEntity<?> preview(@Valid @RequestBody OrdenRequestDTO request) {
        try {
            return ResponseEntity.ok(service.previsualizarOrden(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
