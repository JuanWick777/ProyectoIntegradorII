package com.integradora.back.controller.admin;

import com.integradora.back.controller.promocion.dto.PromocionRequestDTO;
import com.integradora.back.controller.promocion.dto.PromocionResponseDTO;
import com.integradora.back.model.promocion.Promocion;
import com.integradora.back.service.PromocionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class PromocionController {

    private final PromocionService promocionService;

    /* ── Público: lista promociones activas (menú del cliente) ─ */
    @GetMapping("/api/promociones")
    public List<PromocionResponseDTO> listarActivas() {
        return promocionService.listarActivas().stream().map(PromocionResponseDTO::from).toList();
    }

    /* ── Admin: CRUD completo ──────────────────────────────── */
    @GetMapping("/api/admin/promociones")
    public List<PromocionResponseDTO> listarTodas() {
        return promocionService.listarTodas().stream().map(PromocionResponseDTO::from).toList();
    }

    @PostMapping("/api/admin/promociones")
    public ResponseEntity<PromocionResponseDTO> crear(@Valid @RequestBody PromocionRequestDTO req) {
        validarPromocion(req);
        Promocion promo = toEntity(req);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(PromocionResponseDTO.from(promocionService.crear(promo)));
    }

    @PutMapping("/api/admin/promociones/{id}")
    public PromocionResponseDTO actualizar(@PathVariable Long id, @Valid @RequestBody PromocionRequestDTO req) {
        validarPromocion(req);
        Promocion promo = toEntity(req);
        return PromocionResponseDTO.from(promocionService.actualizar(id, promo));
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
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(promocionService.aplicarPromocion(ordenId, body.get("codigoPromo")));
    }

    private static Promocion toEntity(PromocionRequestDTO req) {
        return Promocion.builder()
                .titulo(req.getTitulo())
                .descripcion(req.getDescripcion())
                .tipoDescuento(req.getTipoDescuento())
                .valorDescuento(req.getValorDescuento())
                .codigoPromo(req.getCodigoPromo())
                .activa(req.getActiva() != null ? req.getActiva() : Boolean.TRUE)
                .fechaInicio(req.getFechaInicio())
                .fechaFin(req.getFechaFin())
                .categoriaId(req.getCategoriaId())
                .build();
    }

    private static void validarPromocion(PromocionRequestDTO req) {
        String tipo = req.getTipoDescuento() != null ? req.getTipoDescuento().trim().toUpperCase() : "";
        if ("2X1".equals(tipo) || "DOS_X_UNO".equals(tipo)) {
            if (req.getCategoriaId() == null) {
                throw new IllegalArgumentException("categoriaId es obligatorio para promociones 2x1");
            }
            if (req.getCodigoPromo() == null || req.getCodigoPromo().isBlank()) {
                throw new IllegalArgumentException("codigoPromo es obligatorio para promociones 2x1");
            }
            // valorDescuento no se usa en 2x1, pero lo mantenemos validado por DTO (puede venir 0).
        } else {
            if (req.getValorDescuento() == null || req.getValorDescuento().signum() <= 0) {
                throw new IllegalArgumentException("valorDescuento debe ser mayor a 0");
            }
        }
    }
}
