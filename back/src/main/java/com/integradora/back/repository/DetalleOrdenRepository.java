package com.integradora.back.repository;

import com.integradora.back.model.detalleorden.DetalleOrden;
import com.integradora.back.model.detalleorden.EstadoDetalle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DetalleOrdenRepository extends JpaRepository<DetalleOrden, Long> {


    List<DetalleOrden> findByOrdenId(Long ordenId);

    List<DetalleOrden> findByEstadoPreparacionIn(List<EstadoDetalle> estados);

    List<DetalleOrden> findByCocinaIdAndEstadoPreparacionIn(Long cocinaId, List<EstadoDetalle> estados);

    @Query("""
        SELECT d FROM DetalleOrden d
        JOIN FETCH d.orden o
        JOIN FETCH d.platillo p
        WHERE o.estadoPreparacion IN ('CONFIRMADA','EN_PREPARACION')
        ORDER BY o.fechaCreacion ASC
        """)
    List<DetalleOrden> findTicketsCocina();
}