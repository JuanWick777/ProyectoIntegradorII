package com.integradora.back.service;

import com.integradora.back.model.Categoria;
import com.integradora.back.repository.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository repository;

    public Categoria crear(Categoria categoria) {
        return repository.save(categoria);
    }

    public List<Categoria> listar() {
        return repository.findAll();
    }
}