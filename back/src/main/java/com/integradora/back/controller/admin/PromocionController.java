package com.integradora.back.controller.admin;

import com.integradora.back.model.promocion.Promocion;
import com.integradora.back.service.PromocionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PromocionController {

    private final PromocionService promocionService;

    /* ── Público: lista promociones activas (menú del cliente) ─ */
    @GetMapping("/api/promociones")
    public List<Promocion> listarActivas() {
        return promocionService.listarActivas();
    }

    /* ── Admin: CRUD completo ──────────────────────────────── */
    @GetMapping("/api/admin/promociones")
    public List<Promocion> listarTodas() {
        return promocionService.listarTodas();
    }

    @PostMapping("/api/admin/promociones")
    public ResponseEntity<Promocion> crear(@RequestBody Promocion promo) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(promocionService.crear(promo));
    }

    @PutMapping("/api/admin/promociones/{id}")
    public Promocion actualizar(@PathVariable Long id, @RequestBody Promocion promo) {
        return promocionService.actualizar(id, promo);
    }

    @DeleteMapping("/api/admin/promociones/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        promocionService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    /* ── Mesero: aplicar código a una orden ─────────────────── */
    @PostMapping("/api/mesero/ordenes/{ordenId}/promocion")
    public ResponseEntity<?> aplicar(
            @PathVariable Long ordenId,
            @RequestBody Map<String, String> body
    ) {
        try {
            return ResponseEntity.ok(
                    promocionService.aplicarPromocion(ordenId, body.get("codigoPromo"))
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
