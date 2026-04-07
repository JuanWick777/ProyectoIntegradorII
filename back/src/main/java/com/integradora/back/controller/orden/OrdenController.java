package com.integradora.back.controller.orden;

import com.integradora.back.controller.orden.dto.OrdenRequestDTO;
import com.integradora.back.controller.orden.dto.OrdenResponseDTO;
import com.integradora.back.model.orden.Orden;
import com.integradora.back.service.OrdenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ordenes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class OrdenController {

    private final OrdenService service;

    @PostMapping
    public Orden crear(
            @RequestParam Long clienteId,
            @RequestParam Long mesaId
    ) {
        return service.crear(clienteId, mesaId);
    }

    @GetMapping
    public List<Orden> listar() {
        return service.listar();
    }

    @GetMapping("/cliente/{clienteId}")
    public List<Orden> porCliente(@PathVariable Long clienteId) {
        return service.porCliente(clienteId);
    }

    @PutMapping("/{id}/estado")
    public Orden actualizarEstado(
            @PathVariable Long id,
            @RequestParam String estado
    ) {
        return service.actualizarEstado(id, estado);
    }

    @PostMapping("/completa")
    public OrdenResponseDTO crearCompleta(@RequestBody OrdenRequestDTO request) {
        return service.crearOrdenCompleta(request);
    }

    @GetMapping("/activas")
    public List<Orden> obtenerActivas() {
        return service.obtenerActivas();
    }

    @GetMapping("/historial")
    public List<Orden> historial() {
        return service.historial();
    }
}