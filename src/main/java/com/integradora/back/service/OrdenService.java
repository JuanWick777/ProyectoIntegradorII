package com.integradora.back.service;

import com.integradora.back.model.*;
import com.integradora.back.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrdenService {

    private final OrdenRepository ordenRepository;
    private final UsuarioRepository usuarioRepository;
    private final MesaRepository mesaRepository;

    public Orden crear(Long clienteId, Long mesaId) {

        Usuario cliente = usuarioRepository.findById(clienteId)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        Mesa mesa = mesaRepository.findById(mesaId)
                .orElseThrow(() -> new RuntimeException("Mesa no encontrada"));

        Orden orden = Orden.builder()
                .cliente(cliente)
                .mesa(mesa)
                .estadoPreparacion("Pendiente")
                .fechaCreacion(LocalDateTime.now())
                .build();

        return ordenRepository.save(orden);
    }

    public List<Orden> listar() {
        return ordenRepository.findAll();
    }

    public List<Orden> porCliente(Long clienteId) {
        return ordenRepository.findByClienteId(clienteId);
    }

    public Orden actualizarEstado(Long ordenId, String estado) {
        Orden orden = ordenRepository.findById(ordenId)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada"));

        orden.setEstadoPreparacion(estado);

        if (estado.equals("Finalizado")) {
            orden.setFechaFinalizacion(LocalDateTime.now());
        }

        return ordenRepository.save(orden);
    }
}