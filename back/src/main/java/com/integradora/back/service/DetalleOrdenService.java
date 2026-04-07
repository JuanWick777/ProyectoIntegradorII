package com.integradora.back.service;

import com.integradora.back.model.detalleorden.DetalleOrden;
import com.integradora.back.model.detalleorden.EstadoDetalle;
import com.integradora.back.model.orden.Orden;
import com.integradora.back.model.platillo.Platillo;
import com.integradora.back.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DetalleOrdenService {

    private final DetalleOrdenRepository detalleRepository;
    private final OrdenRepository ordenRepository;
    private final PlatilloRepository platilloRepository;

    public DetalleOrden agregarDetalle(
            Long ordenId,
            Long platilloId,
            Integer cantidad,
            String nota
    ) {

        Orden orden = ordenRepository.findById(ordenId)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada"));

        Platillo platillo = platilloRepository.findById(platilloId)
                .orElseThrow(() -> new RuntimeException("Platillo no encontrado"));

        if (platillo.getStock() != null && platillo.getStock() < cantidad) {
            throw new RuntimeException("Stock insuficiente para el platillo: " + platillo.getNombre());
        }

        BigDecimal precio = platillo.getPrecio();
        BigDecimal subtotal = precio.multiply(BigDecimal.valueOf(cantidad));

        DetalleOrden detalle = DetalleOrden.builder()
                .orden(orden)
                .platillo(platillo)
                .cocina(platillo.getCocina())
                .cantidad(cantidad)
                .precioUnitario(precio)
                .subtotal(subtotal)
                .notaCliente(nota)
                .estadoPreparacion(EstadoDetalle.PENDIENTE)
                .build();

        if (platillo.getStock() != null) {
            platillo.setStock(platillo.getStock() - cantidad);
            platilloRepository.save(platillo);
        }

        return detalleRepository.save(detalle);
    }

    public List<DetalleOrden> obtenerPorOrden(Long ordenId) {
        return detalleRepository.findByOrdenId(ordenId);
    }

    public List<DetalleOrden> obtenerPendientes() {
        return detalleRepository.findByEstadoPreparacionIn(
                List.of(
                        EstadoDetalle.PENDIENTE,
                        EstadoDetalle.EN_PREPARACION
                )
        );
    }

    public DetalleOrden cambiarEstado(Long id, String estado) {

        DetalleOrden detalle = detalleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Detalle no encontrado"));

        try {
            EstadoDetalle nuevoEstado = EstadoDetalle.valueOf(estado.toUpperCase());
            detalle.setEstadoPreparacion(nuevoEstado);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Estado inválido: " + estado);
        }

        return detalleRepository.save(detalle);
    }
}