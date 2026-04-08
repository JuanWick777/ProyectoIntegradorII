package com.integradora.back.controller.admin;

import com.integradora.back.controller.platillo.dto.PlatilloAdminDTO;
import com.integradora.back.controller.platillo.dto.PlatilloResponseDTO;
import com.integradora.back.model.categoria.Categoria;
import com.integradora.back.model.cocina.Cocina;
import com.integradora.back.model.platillo.Platillo;
import com.integradora.back.repository.CategoriaRepository;
import com.integradora.back.repository.CocinaRepository;
import com.integradora.back.repository.PlatilloRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/platillos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PlatilloAdminController {

    private final PlatilloRepository platilloRepository;
    private final CategoriaRepository categoriaRepository;
    private final CocinaRepository cocinaRepository;

    /* ── GET todos ─────────────────────────────────────────── */
    @GetMapping
    public List<PlatilloResponseDTO> listar() {
        return platilloRepository.findAll()
                .stream()
                .map(PlatilloResponseDTO::from)
                .toList();
    }

    /* ── POST crear ─────────────────────────────────────────── */
    @PostMapping
    public ResponseEntity<PlatilloResponseDTO> crear(@RequestBody PlatilloAdminDTO dto) {
        Platillo p = buildFromDTO(new Platillo(), dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(PlatilloResponseDTO.from(platilloRepository.save(p)));
    }

    /* ── PUT actualizar ─────────────────────────────────────── */
    @PutMapping("/{id}")
    public ResponseEntity<PlatilloResponseDTO> actualizar(
            @PathVariable Long id,
            @RequestBody PlatilloAdminDTO dto
    ) {
        Platillo p = platilloRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Platillo no encontrado: " + id));
        buildFromDTO(p, dto);
        return ResponseEntity.ok(PlatilloResponseDTO.from(platilloRepository.save(p)));
    }

    /* ── DELETE ──────────────────────────────────────────────── */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        platilloRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /* ── Helper ──────────────────────────────────────────────── */
    private Platillo buildFromDTO(Platillo platillo, PlatilloAdminDTO dto) {
        if (dto.getNombre() != null)     platillo.setNombre(dto.getNombre());
        if (dto.getDescripcion() != null) platillo.setDescripcion(dto.getDescripcion());
        if (dto.getPrecio() != null)     platillo.setPrecio(dto.getPrecio());
        if (dto.getImagenUrl() != null)  platillo.setUrlImagen(dto.getImagenUrl());
        if (dto.getStock() != null)      platillo.setStock(dto.getStock());

        if (dto.getCategoriaId() != null) {
            Categoria cat = categoriaRepository.findById(dto.getCategoriaId())
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
            platillo.setCategoria(cat);
        }
        if (dto.getKitchenId() != null) {
            Cocina cocina = cocinaRepository.findById(dto.getKitchenId())
                    .orElseThrow(() -> new RuntimeException("Cocina no encontrada"));
            platillo.setCocina(cocina);
        }
        return platillo;
    }
}
