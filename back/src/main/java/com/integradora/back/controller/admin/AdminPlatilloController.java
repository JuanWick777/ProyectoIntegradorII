package com.integradora.back.controller.admin;

import com.integradora.back.model.platillo.Platillo;
import com.integradora.back.repository.PlatilloRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/platillos")
@RequiredArgsConstructor
public class AdminPlatilloController {

    private final PlatilloRepository repository;

    @GetMapping
    public List<Platillo> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public Platillo create(@RequestBody Platillo p) {
        return repository.save(p);
    }

    @PutMapping("/{id}")
    public Platillo update(@PathVariable Long id, @RequestBody Platillo req) {
        Platillo platillo = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Platillo no encontrado"));

        platillo.setNombre(req.getNombre());
        platillo.setDescripcion(req.getDescripcion());
        platillo.setCategoria(req.getCategoria());
        platillo.setPrecio(req.getPrecio());
        platillo.setUrlImagen(req.getUrlImagen());
        platillo.setEstado(req.getEstado());

        return repository.save(platillo);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
