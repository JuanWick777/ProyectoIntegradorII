package com.integradora.back.service;

import com.integradora.back.model.orden.Orden;
import com.integradora.back.model.promocion.Promocion;
import com.integradora.back.repository.DetalleOrdenRepository;
import com.integradora.back.repository.OrdenRepository;
import com.integradora.back.repository.PromocionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PromocionService {

    private final PromocionRepository promocionRepository;
    private final OrdenRepository ordenRepository;
    private final DetalleOrdenRepository detalleOrdenRepository;

    // ── Listados ───────────────────────────────────────────────
    public List<Promocion> listarActivas() {
        LocalDate hoy = LocalDate.now();
        return promocionRepository.findByActivaTrue().stream()
                .filter(p -> (p.getFechaInicio() == null || !hoy.isBefore(p.getFechaInicio()))
                          && (p.getFechaFin()   == null || !hoy.isAfter(p.getFechaFin())))
                .toList();
    }

    public List<Promocion> listarTodas() {
        return promocionRepository.findAll();
    }

    // ── CRUD ───────────────────────────────────────────────────
    public Promocion crear(Promocion promo) {
        return promocionRepository.save(promo);
    }

    public Promocion actualizar(Long id, Promocion req) {
        Promocion p = promocionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promoción no encontrada"));
        p.setTitulo(req.getTitulo());
        p.setDescripcion(req.getDescripcion());
        p.setTipoDescuento(req.getTipoDescuento());
        p.setValorDescuento(req.getValorDescuento());
        p.setCodigoPromo(req.getCodigoPromo());
        p.setCategoriaId(req.getCategoriaId());
        p.setActiva(req.getActiva());
        p.setFechaInicio(req.getFechaInicio());
        p.setFechaFin(req.getFechaFin());
        return promocionRepository.save(p);
    }

    public void eliminar(Long id) {
        promocionRepository.deleteById(id);
    }

    // ── Aplicar a orden ────────────────────────────────────────
    /**
     * Aplica el descuento de la promo a la orden indicada.
     * Modifica: orden.montoDescuento, orden.codigoPromoAplicado, orden.total
     * @return la orden actualizada
     */
    @Transactional
    public Orden aplicarPromocion(Long ordenId, String codigoPromo) {
        Orden orden = ordenRepository.findById(ordenId)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada"));

        Promocion promo = promocionRepository.findByCodigoPromoIgnoreCase(codigoPromo)
                .orElseThrow(() -> new RuntimeException("Código de promoción inválido"));

        // Validar vigencia
        LocalDate hoy = LocalDate.now();
        if (!Boolean.TRUE.equals(promo.getActiva())) {
            throw new RuntimeException("La promoción no está activa");
        }
        if (promo.getFechaFin() != null && hoy.isAfter(promo.getFechaFin())) {
            throw new RuntimeException("La promoción ya venció");
        }

        BigDecimal subtotal = orden.getSubtotal() != null ? orden.getSubtotal() : BigDecimal.ZERO;
        BigDecimal descuento;

        if ("2X1".equalsIgnoreCase(promo.getTipoDescuento()) || "DOS_X_UNO".equalsIgnoreCase(promo.getTipoDescuento())) {
            descuento = calcularDescuento2x1PorCategoria(ordenId, promo.getCategoriaId());
        } else if ("PORCENTAJE".equalsIgnoreCase(promo.getTipoDescuento())) {
            descuento = subtotal.multiply(promo.getValorDescuento())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        } else {
            descuento = promo.getValorDescuento().min(subtotal);
        }

        orden.setMontoDescuento(descuento);
        orden.setCodigoPromoAplicado(promo.getCodigoPromo());
        orden.setTotal(subtotal.subtract(descuento).max(BigDecimal.ZERO));

        return ordenRepository.save(orden);
    }

    private BigDecimal calcularDescuento2x1PorCategoria(Long ordenId, Long categoriaId) {
        if (categoriaId == null) {
            throw new RuntimeException("La promoción 2x1 requiere una categoría asignada");
        }

        // Traer detalles con platillo+categoria para validar correctamente
        var detalles = detalleOrdenRepository.findByOrdenIdWithPlatilloCategoria(ordenId);

        List<BigDecimal> preciosUnitarios = new ArrayList<>();
        for (var d : detalles) {
            var platillo = d.getPlatillo();
            var catId = platillo != null && platillo.getCategoria() != null ? platillo.getCategoria().getId() : null;
            if (catId == null || !catId.equals(categoriaId)) continue;

            BigDecimal precio = d.getPrecioUnitario() != null ? d.getPrecioUnitario() : BigDecimal.ZERO;
            int qty = d.getCantidad() != null ? d.getCantidad() : 0;
            for (int i = 0; i < qty; i++) {
                preciosUnitarios.add(precio);
            }
        }

        int totalQty = preciosUnitarios.size();
        int freeCount = totalQty / 2; // 2x1: por cada 2, 1 gratis
        if (freeCount <= 0) {
            throw new RuntimeException("La promoción 2x1 requiere al menos 2 productos de la categoría seleccionada");
        }

        preciosUnitarios.sort(Comparator.naturalOrder());
        BigDecimal descuento = BigDecimal.ZERO;
        for (int i = 0; i < freeCount; i++) {
            descuento = descuento.add(preciosUnitarios.get(i));
        }

        return descuento.max(BigDecimal.ZERO);
    }

    public List<Promocion> listarAutomaticasVigentes() {
        LocalDate hoy = LocalDate.now();

        return promocionRepository.findByActivaTrue().stream()
                .filter(p -> (p.getFechaInicio() == null || !hoy.isBefore(p.getFechaInicio()))
                        && (p.getFechaFin() == null || !hoy.isAfter(p.getFechaFin())))
                .filter(p -> p.getCodigoPromo() == null || p.getCodigoPromo().isBlank())
                .toList();
    }

    public BigDecimal calcularDescuento(Promocion promo, BigDecimal subtotal) {
        if (promo == null || subtotal == null || subtotal.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }

        BigDecimal descuento;

        if ("2X1".equalsIgnoreCase(promo.getTipoDescuento()) || "DOS_X_UNO".equalsIgnoreCase(promo.getTipoDescuento())) {
            // Las promos 2x1 dependen de los detalles; no son compatibles con el cálculo por subtotal.
            return BigDecimal.ZERO;
        } else if ("PORCENTAJE".equalsIgnoreCase(promo.getTipoDescuento())) {
            descuento = subtotal.multiply(promo.getValorDescuento())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        } else {
            descuento = promo.getValorDescuento().min(subtotal);
        }

        return descuento.max(BigDecimal.ZERO);
    }

    public Promocion obtenerMejorPromocionAutomatica(BigDecimal subtotal) {
        return listarAutomaticasVigentes().stream()
                .max((a, b) -> calcularDescuento(a, subtotal).compareTo(calcularDescuento(b, subtotal)))
                .orElse(null);
    }

}
