package com.integradora.back.repository;

import com.integradora.back.model.detalleorden.DetalleOrden;
import com.integradora.back.model.detalleorden.EstadoDetalle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DetalleOrdenRepository extends JpaRepository<DetalleOrden, Long> {

    List<DetalleOrden> findByOrdenId(Long ordenId);

    @Query("""
        SELECT d FROM DetalleOrden d
        JOIN FETCH d.platillo p
        LEFT JOIN FETCH p.categoria c
        WHERE d.orden.id = :ordenId
        """)
    List<DetalleOrden> findByOrdenIdWithPlatilloCategoria(Long ordenId);

    List<DetalleOrden> findByEstadoPreparacionIn(List<EstadoDetalle> estados);

    @Query("""
        SELECT d FROM DetalleOrden d
        JOIN FETCH d.orden o
        JOIN FETCH d.platillo p
        WHERE o.estadoPreparacion IN ('CONFIRMADA','EN_PREPARACION','LISTA')
        ORDER BY o.fechaCreacion ASC
        """)
    List<DetalleOrden> findTicketsCocina();

    @Query("""
        SELECT d FROM DetalleOrden d
        JOIN FETCH d.orden o
        JOIN FETCH d.platillo p
        WHERE o.estadoPreparacion IN ('ENTREGADA','CERRADA','CANCELADA')
        ORDER BY o.fechaFinalizacion DESC, o.id DESC
        """)
    List<DetalleOrden> findHistorialCocina();
}
