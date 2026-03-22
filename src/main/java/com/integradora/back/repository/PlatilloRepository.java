package com.integradora.back.repository;

import com.integradora.back.model.Platillo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlatilloRepository extends JpaRepository<Platillo, Long> {

    List<Platillo> findByCategoriaId(Long categoriaId);

    List<Platillo> findByEstado(String estado);
}