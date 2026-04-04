package com.integradora.back.service;

import com.integradora.back.model.categoria.Categoria;
import com.integradora.back.model.platillo.Platillo;
import com.integradora.back.repository.CategoriaRepository;
import com.integradora.back.repository.PlatilloRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlatilloService {

    private final PlatilloRepository platilloRepository;
    private final CategoriaRepository categoriaRepository;

    public Platillo crear(Platillo platillo, Long categoriaId) {

        Categoria categoria = categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        platillo.setCategoria(categoria);

        return platilloRepository.save(platillo);
    }

    public List<Platillo> listar() {
        return platilloRepository.findAll();
    }

    public List<Platillo> listarPorCategoria(Long categoriaId) {
        return platilloRepository.findByCategoriaId(categoriaId);
    }
}