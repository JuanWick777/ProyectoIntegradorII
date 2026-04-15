package com.integradora.back.repository;

import com.integradora.back.model.meseromesa.MeseroMesa;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MeseroMesaRepository extends JpaRepository<MeseroMesa, Long> {
    List<MeseroMesa> findByMeseroIdOrderByMesaNumeroAsc(Long meseroId);
    void deleteByMeseroId(Long meseroId);
    boolean existsByMeseroIdAndMesaId(Long meseroId, Long mesaId);
    boolean existsByMesaIdAndMeseroIdNot(Long mesaId, Long meseroId);
}
