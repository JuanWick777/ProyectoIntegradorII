package com.integradora.back.service;

import com.integradora.back.model.detalleorden.DetalleOrden;
import com.integradora.back.model.detalleorden.EstadoDetalle;
import com.integradora.back.model.orden.EstadoOrden;
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

        if ("AGOTADO".equalsIgnoreCase(platillo.getDisponibilidad())) {
            throw new RuntimeException("El platillo se encuentra agotado: " + platillo.getNombre());
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

        EstadoDetalle nuevoEstado = EstadoDetalle.valueOf(estado.toUpperCase());
        detalle.setEstadoPreparacion(nuevoEstado);

        detalle = detalleRepository.save(detalle);

        Orden orden = detalle.getOrden();

        List<DetalleOrden> detalles = detalleRepository.findByOrdenId(orden.getId());

        // Si al menos un detalle entra a preparación, la orden debe reflejarlo.
        // Esto permite que mesero/cliente vean "en_preparacion" mientras cocina trabaja.
        boolean algunoEnPreparacion = detalles.stream()
                .anyMatch(d -> d.getEstadoPreparacion() == EstadoDetalle.EN_PREPARACION);

        boolean todosListos = detalles.stream()
                .allMatch(d -> d.getEstadoPreparacion() == EstadoDetalle.LISTO);

        if (todosListos) {
            orden.setEstadoPreparacion(EstadoOrden.LISTA);
            ordenRepository.save(orden);
        } else if (algunoEnPreparacion) {
            // Evitar sobreescribir estados finales (por si se extendiera el enum en el futuro)
            if (orden.getEstadoPreparacion() != EstadoOrden.ENTREGADA
                    && orden.getEstadoPreparacion() != EstadoOrden.CERRADA
                    && orden.getEstadoPreparacion() != EstadoOrden.CANCELADA) {
                orden.setEstadoPreparacion(EstadoOrden.EN_PREPARACION);
                ordenRepository.save(orden);
            }
        }

        return detalle;
    }
}