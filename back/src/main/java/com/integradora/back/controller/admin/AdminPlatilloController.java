package com.integradora.back.controller.admin;

import com.integradora.back.controller.platillo.dto.PlatilloAdminDTO;
import com.integradora.back.controller.platillo.dto.PlatilloResponseDTO;
import com.integradora.back.model.categoria.Categoria;
import com.integradora.back.model.platillo.Platillo;
import com.integradora.back.repository.CategoriaRepository;
import com.integradora.back.repository.PlatilloRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/platillos")
@RequiredArgsConstructor
public class AdminPlatilloController {

    private final PlatilloRepository repository;
    private final CategoriaRepository categoriaRepository;

    @GetMapping
    public List<PlatilloResponseDTO> getAll() {
        return repository.findAll()
                .stream()
                .map(PlatilloResponseDTO::from)
                .toList();
    }

    @PostMapping
    public ResponseEntity<PlatilloResponseDTO> create(@RequestBody PlatilloAdminDTO dto) {
        Platillo p = buildFromDTO(new Platillo(), dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(PlatilloResponseDTO.from(repository.save(p)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlatilloResponseDTO> update(
            @PathVariable Long id,
            @RequestBody PlatilloAdminDTO dto
    ) {
        Platillo p = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Platillo no encontrado: " + id));
        buildFromDTO(p, dto);
        return ResponseEntity.ok(PlatilloResponseDTO.from(repository.save(p)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private Platillo buildFromDTO(Platillo platillo, PlatilloAdminDTO dto) {
        if (dto.getNombre() != null) {
            platillo.setNombre(dto.getNombre());
        }
        if (dto.getDescripcion() != null) {
            platillo.setDescripcion(dto.getDescripcion());
        }
        if (dto.getPrecio() != null) {
            platillo.setPrecio(dto.getPrecio());
        }
        if (dto.getImagenUrl() != null) {
            platillo.setUrlImagen(dto.getImagenUrl());
        }

        String estado = dto.getEstado() != null ? dto.getEstado() : dto.getDisponibilidad();
        if (estado != null) {
            platillo.setEstado(estado);
        }

        if (dto.getCategoriaId() != null) {
            Categoria cat = categoriaRepository.findById(dto.getCategoriaId())
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
            platillo.setCategoria(cat);
        }

        return platillo;
    }
}
