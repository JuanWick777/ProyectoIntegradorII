package com.integradora.back.service;

import com.integradora.back.model.platillo.Platillo;
import com.integradora.back.repository.PlatilloRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PlatilloService {

    private final PlatilloRepository platilloRepository;

    @Transactional(readOnly = true)
    public List<Platillo> listar() {
        return platilloRepository.findAll().stream()
                .filter(this::esVisibleParaCliente)
                .toList();
    }

    private boolean esVisibleParaCliente(Platillo platillo) {
        String estado = platillo.getEstado() == null ? "" : platillo.getEstado().trim().toUpperCase();
        return "DISPONIBLE".equals(estado) || "ACTIVO".equals(estado);
    }
}
