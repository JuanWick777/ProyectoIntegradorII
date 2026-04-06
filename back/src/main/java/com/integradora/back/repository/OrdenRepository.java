package com.integradora.back.repository;

import com.integradora.back.model.orden.EstadoOrden;
import com.integradora.back.model.orden.Orden;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrdenRepository extends JpaRepository<Orden, Long> {

    List<Orden> findByClienteId(Long clienteId);

    List<Orden> findByEstadoPreparacionNotIn(List<EstadoOrden> estados);

    List<Orden> findTop50ByEstadoPreparacionInOrderByIdDesc(
            List<EstadoOrden> estados
    );
}