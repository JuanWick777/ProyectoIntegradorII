package com.integradora.back.service;

import com.integradora.back.model.*;
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

        BigDecimal precio = platillo.getPrecio();
        BigDecimal subtotal = precio.multiply(BigDecimal.valueOf(cantidad));

        DetalleOrden detalle = DetalleOrden.builder()
                .orden(orden)
                .platillo(platillo)
                .cantidad(cantidad)
                .precioUnitario(precio)
                .subtotal(subtotal)
                .notaCliente(nota)
                .build();

        return detalleRepository.save(detalle);
    }

    public List<DetalleOrden> obtenerPorOrden(Long ordenId) {
        return detalleRepository.findByOrdenId(ordenId);
    }
}