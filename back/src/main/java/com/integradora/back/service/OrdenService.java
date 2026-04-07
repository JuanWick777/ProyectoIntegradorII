package com.integradora.back.service;

import com.integradora.back.controller.detalleorden.dto.DetalleOrdenDTO;
import com.integradora.back.controller.detalleorden.dto.DetalleOrdenRequestDTO;
import com.integradora.back.controller.orden.OrdenMapper;
import com.integradora.back.controller.orden.dto.OrdenRequestDTO;
import com.integradora.back.controller.orden.dto.OrdenResponseDTO;
import com.integradora.back.model.detalleorden.DetalleOrden;
import com.integradora.back.model.detalleorden.EstadoDetalle;
import com.integradora.back.model.mesa.Mesa;
import com.integradora.back.model.orden.EstadoOrden;
import com.integradora.back.model.orden.Orden;
import com.integradora.back.model.platillo.Platillo;
import com.integradora.back.model.usuario.Usuario;
import com.integradora.back.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrdenService {

    private final OrdenRepository ordenRepository;
    private final UsuarioRepository usuarioRepository;
    private final MesaRepository mesaRepository;
    private final PlatilloRepository platilloRepository;
    private final DetalleOrdenRepository detalleRepository;

    public Orden crear(Long clienteId, Long mesaId) {

        Usuario cliente = usuarioRepository.findById(clienteId)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        Mesa mesa = mesaRepository.findById(mesaId)
                .orElseThrow(() -> new RuntimeException("Mesa no encontrada"));

        Orden orden = Orden.builder()
                .cliente(cliente)
                .mesa(mesa)
                .estadoPreparacion(EstadoOrden.PENDIENTE_CONFIRMACION)
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

        EstadoOrden nuevoEstado;
        try {
            nuevoEstado = EstadoOrden.valueOf(estado.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Estado inválido: " + estado);
        }

        orden.setEstadoPreparacion(nuevoEstado);

        if (nuevoEstado == EstadoOrden.ENTREGADA || nuevoEstado == EstadoOrden.CANCELADA) {
            orden.setFechaFinalizacion(LocalDateTime.now());
        }

        return ordenRepository.save(orden);
    }

    @Transactional
    public OrdenResponseDTO crearOrdenCompleta(OrdenRequestDTO request) {

        Usuario cliente = usuarioRepository.findById(request.getClienteId())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        Mesa mesa = mesaRepository.findById(request.getMesaId())
                .orElseThrow(() -> new RuntimeException("Mesa no encontrada"));

        Orden orden = Orden.builder()
                .cliente(cliente)
                .mesa(mesa)
                .estadoPreparacion(EstadoOrden.PENDIENTE_CONFIRMACION)
                .fechaCreacion(LocalDateTime.now())
                .build();

        orden = ordenRepository.save(orden);

        for (DetalleOrdenRequestDTO det : request.getDetalles()) {

            Platillo platillo = platilloRepository.findById(det.getPlatilloId())
                    .orElseThrow(() -> new RuntimeException("Platillo no encontrado"));

            if (platillo.getStock() != null && platillo.getStock() < det.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para el platillo: " + platillo.getNombre());
            }

            BigDecimal precio = platillo.getPrecio();
            BigDecimal subtotal = precio.multiply(BigDecimal.valueOf(det.getCantidad()));

            DetalleOrden detalle = DetalleOrden.builder()
                    .orden(orden)
                    .platillo(platillo)
                    .cocina(platillo.getCocina())
                    .cantidad(det.getCantidad())
                    .precioUnitario(precio)
                    .subtotal(subtotal)
                    .notaCliente(det.getNota())
                    .estadoPreparacion(EstadoDetalle.PENDIENTE)
                    .build();

            detalleRepository.save(detalle);

            if (platillo.getStock() != null) {
                platillo.setStock(platillo.getStock() - det.getCantidad());
                platilloRepository.save(platillo);
            }
        }

        List<DetalleOrden> detalles = detalleRepository.findByOrdenId(orden.getId());
        BigDecimal subtotalTotal = detalles.stream()
                .map(DetalleOrden::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        orden.setSubtotal(subtotalTotal);
        orden.setTotal(subtotalTotal);
        orden = ordenRepository.save(orden);

        return OrdenMapper.toDTO(orden, detalles);
    }

    public List<Orden> obtenerActivas() {
        return ordenRepository.findByEstadoPreparacionNotIn(
                List.of(
                        EstadoOrden.ENTREGADA,
                        EstadoOrden.CANCELADA
                )
        );
    }

    public List<Orden> historial() {
        return ordenRepository.findTop50ByEstadoPreparacionInOrderByIdDesc(
                List.of(
                        EstadoOrden.ENTREGADA,
                        EstadoOrden.CANCELADA
                )
        );
    }
}