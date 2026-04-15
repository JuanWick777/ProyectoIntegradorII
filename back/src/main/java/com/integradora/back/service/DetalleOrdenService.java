package com.integradora.back.service;

import com.integradora.back.model.detalleorden.DetalleOrden;
import com.integradora.back.model.detalleorden.EstadoDetalle;
import com.integradora.back.model.orden.EstadoOrden;
import com.integradora.back.model.orden.Orden;
import com.integradora.back.repository.DetalleOrdenRepository;
import com.integradora.back.repository.OrdenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DetalleOrdenService {

    private final DetalleOrdenRepository detalleRepository;
    private final OrdenRepository ordenRepository;

    @Transactional
    public DetalleOrden cambiarEstado(Long id, String estado) {

        DetalleOrden detalle = detalleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Detalle no encontrado"));

        EstadoDetalle nuevoEstado = EstadoDetalle.valueOf(estado.toUpperCase());
        detalle.setEstadoPreparacion(nuevoEstado);

        detalle = detalleRepository.save(detalle);

        Orden orden = detalle.getOrden();

        List<DetalleOrden> detalles = detalleRepository.findByOrdenId(orden.getId());

        boolean algunoEnPreparacion = detalles.stream()
                .anyMatch(d -> d.getEstadoPreparacion() == EstadoDetalle.EN_PREPARACION);

        boolean todosListos = detalles.stream()
                .allMatch(d -> d.getEstadoPreparacion() == EstadoDetalle.LISTO);

        if (todosListos) {
            orden.setEstadoPreparacion(EstadoOrden.LISTA);
            ordenRepository.save(orden);
        } else if (algunoEnPreparacion) {
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
