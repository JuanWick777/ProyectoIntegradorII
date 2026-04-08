package com.integradora.back.repository;

import com.integradora.back.model.mesa.Mesa;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MesaRepository extends JpaRepository<Mesa, Long> {
    Optional<Mesa> findByNumero(Integer numero);
}