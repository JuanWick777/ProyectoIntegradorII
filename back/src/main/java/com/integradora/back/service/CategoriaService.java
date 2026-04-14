package com.integradora.back.service;

import com.integradora.back.model.categoria.Categoria;
import com.integradora.back.repository.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoriaService {

    private final CategoriaRepository repository;

    @Transactional
    public Categoria crear(Categoria categoria) {
        return repository.save(categoria);
    }

    @Transactional(readOnly = true)
    public List<Categoria> listar() {
        return repository.findAll();
    }
}
