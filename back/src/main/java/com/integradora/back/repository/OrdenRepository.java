package com.integradora.back.repository;

import com.integradora.back.model.orden.EstadoOrden;
import com.integradora.back.model.orden.Orden;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrdenRepository extends JpaRepository<Orden, Long> {

    List<Orden> findByClienteId(Long clienteId);

    List<Orden> findByEstadoPreparacionNotIn(List<EstadoOrden> estados);

    @Query("""
        SELECT o FROM Orden o
        WHERE o.mesa.numero BETWEEN :desde AND :hasta
        AND o.estadoPreparacion NOT IN :estados
    """)
    List<Orden> findByMesaRangoAndEstadoNotIn(
            Integer desde,
            Integer hasta,
            List<EstadoOrden> estados
    );

    List<Orden> findTop50ByEstadoPreparacionInOrderByIdDesc(
            List<EstadoOrden> estados
    );
}