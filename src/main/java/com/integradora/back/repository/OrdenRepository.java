package com.integradora.back.repository;

import com.integradora.back.model.Orden;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrdenRepository extends JpaRepository<Orden, Long> {

    List<Orden> findByClienteId(Long clienteId);

    List<Orden> findByEstadoPreparacion(String estado);
}