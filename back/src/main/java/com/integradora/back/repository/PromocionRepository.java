package com.integradora.back.repository;

import com.integradora.back.model.promocion.Promocion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PromocionRepository extends JpaRepository<Promocion, Long> {
    List<Promocion> findByActivaTrue();
    Optional<Promocion> findByCodigoPromoIgnoreCase(String codigoPromo);
}
