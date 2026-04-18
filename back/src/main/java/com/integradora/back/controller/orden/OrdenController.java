package com.integradora.back.controller.orden;

import com.integradora.back.controller.orden.dto.OrdenPreviewDTO;
import com.integradora.back.controller.orden.dto.OrdenRequestDTO;
import com.integradora.back.controller.orden.dto.OrdenResponseDTO;
import com.integradora.back.controller.orden.dto.ActualizarEstadoOrdenRequest;
import com.integradora.back.model.orden.Orden;
import com.integradora.back.repository.DetalleOrdenRepository;
import com.integradora.back.service.OrdenService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
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
            @RequestBody ActualizarEstadoOrdenRequest body
    ) {
        Orden orden = service.actualizarEstado(
                id,
                body.getEstado(),
                body.getMotivo(),
                Boolean.TRUE.equals(body.getConfirmarCancelacionCocina())
        );
        return OrdenMapper.toDTO(orden, detalleOrdenRepository.findByOrdenId(orden.getId()));
    }

    @PostMapping("/completa")
    public ResponseEntity<OrdenResponseDTO> crearCompleta(@Valid @RequestBody OrdenRequestDTO request) {
        return ResponseEntity.ok(service.crearOrdenCompleta(request));
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
