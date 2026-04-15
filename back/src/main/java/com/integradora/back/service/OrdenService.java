package com.integradora.back.service;

import com.integradora.back.controller.detalleorden.dto.DetalleOrdenRequestDTO;
import com.integradora.back.controller.orden.OrdenMapper;
import com.integradora.back.controller.orden.dto.OrdenPreviewDTO;
import com.integradora.back.controller.orden.dto.OrdenRequestDTO;
import com.integradora.back.controller.orden.dto.OrdenResponseDTO;
import com.integradora.back.model.detalleorden.DetalleOrden;
import com.integradora.back.model.detalleorden.EstadoDetalle;
import com.integradora.back.model.orden.EstadoOrden;
import com.integradora.back.model.orden.Orden;
import com.integradora.back.model.platillo.Platillo;
import com.integradora.back.model.promocion.Promocion;
import com.integradora.back.model.usuario.Usuario;
import com.integradora.back.repository.DetalleOrdenRepository;
import com.integradora.back.repository.MesaRepository;
import com.integradora.back.repository.OrdenRepository;
import com.integradora.back.repository.PlatilloRepository;
import com.integradora.back.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrdenService {

    private final OrdenRepository ordenRepository;
    private final UsuarioRepository usuarioRepository;
    private final MesaRepository mesaRepository;
    private final PlatilloRepository platilloRepository;
    private final DetalleOrdenRepository detalleRepository;
    private final PromocionService promocionService;

    @Transactional
    public Orden actualizarEstado(Long ordenId, String estado) {
        Orden orden = ordenRepository.findById(ordenId)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada"));

        EstadoOrden nuevoEstado;
        try {
            nuevoEstado = EstadoOrden.valueOf(estado.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Estado inválido: " + estado);
        }

        orden.setEstadoPreparacion(nuevoEstado);

        if (nuevoEstado == EstadoOrden.ENTREGADA
                || nuevoEstado == EstadoOrden.CANCELADA
                || nuevoEstado == EstadoOrden.CERRADA) {
            orden.setFechaFinalizacion(LocalDateTime.now());
        }

        if (estado.equalsIgnoreCase("confirmada")) {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
                Usuario meseroActual = usuarioRepository.findByCorreo(auth.getName())
                        .orElseThrow(() -> new RuntimeException("Mesero no encontrado"));

                if (orden.getMesero() == null || !orden.getMesero().getId().equals(meseroActual.getId())) {
                    long activas = ordenRepository.countByMeseroIdAndEstadoPreparacionIn(
                            meseroActual.getId(),
                            List.of(EstadoOrden.CONFIRMADA, EstadoOrden.EN_PREPARACION, EstadoOrden.LISTA)
                    );

                    if (activas >= 3) {
                        throw new RuntimeException("Límite alcanzado: Ya tienes 3 mesas activas asignadas.");
                    }
                    orden.setMesero(meseroActual);
                }
            }

            List<DetalleOrden> detalles = detalleRepository.findByOrdenId(ordenId);
            for (DetalleOrden d : detalles) {
                d.setEstadoPreparacion(EstadoDetalle.PENDIENTE);
            }
            detalleRepository.saveAll(detalles);
        }

        return ordenRepository.save(orden);
    }

    @Transactional
    public OrdenResponseDTO crearOrdenCompleta(OrdenRequestDTO request) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        Usuario cliente;
        if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
            cliente = usuarioRepository.findByCorreo(auth.getName())
                    .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        } else {
            cliente = usuarioRepository.findById(1L)
                    .orElseThrow(() -> new RuntimeException("No se pudo identificar al cliente invitado"));
        }

        var mesa = mesaRepository.findByNumero(request.getMesaId().intValue())
                .orElseThrow(() -> new RuntimeException("Mesa no encontrada con el numero: " + request.getMesaId()));

        Orden orden = Orden.builder()
                .cliente(cliente)
                .mesa(mesa)
                .estadoPreparacion(EstadoOrden.PENDIENTE_CONFIRMACION)
                .fechaCreacion(LocalDateTime.now())
                .build();

        if ("MESERO".equals(cliente.getRolEspecifico())) {
            orden.setMesero(cliente);
        }

        orden = ordenRepository.save(orden);

        BigDecimal subtotal = null;
        for (DetalleOrdenRequestDTO det : request.getDetalles()) {

            Platillo platillo = platilloRepository.findById(det.getPlatilloId())
                    .orElseThrow(() -> new RuntimeException("Platillo no encontrado"));

            if ("AGOTADO".equalsIgnoreCase(platillo.getEstado())
                    || "INACTIVO".equalsIgnoreCase(platillo.getEstado())) {
                throw new RuntimeException("El platillo se encuentra agotado: " + platillo.getNombre());
            }

            BigDecimal precio = platillo.getPrecio();
            subtotal = precio.multiply(BigDecimal.valueOf(det.getCantidad()));

            DetalleOrden detalle = DetalleOrden.builder()
                    .orden(orden)
                    .platillo(platillo)
                    .cantidad(det.getCantidad())
                    .precioUnitario(precio)
                    .subtotal(subtotal)
                    .notaCliente(det.getNota())
                    .estadoPreparacion(EstadoDetalle.PENDIENTE)
                    .build();

            detalleRepository.save(detalle);
        }

        List<DetalleOrden> detalles = detalleRepository.findByOrdenId(orden.getId());
        BigDecimal subtotalTotal = detalles.stream()
                .map(DetalleOrden::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal descuentoPromo = BigDecimal.ZERO;
        String codigoPromoAplicado = null;

        var promoAutomatica = promocionService.obtenerMejorPromocionAutomatica(subtotalTotal);
        if (promoAutomatica != null) {
            descuentoPromo = promocionService.calcularDescuento(promoAutomatica, subtotalTotal);
            codigoPromoAplicado = promoAutomatica.getCodigoPromo();
        }

        BigDecimal subtotalDespuesPromo = subtotalTotal.subtract(descuentoPromo).max(BigDecimal.ZERO);

        BigDecimal descuentoPuntos = BigDecimal.ZERO;
        if (Boolean.TRUE.equals(request.getUsarPuntos())) {
            int puntosDisponibles = cliente.getPuntosLealtad();
            descuentoPuntos = new BigDecimal(puntosDisponibles);

            if (descuentoPuntos.compareTo(subtotalDespuesPromo) > 0) {
                descuentoPuntos = subtotalDespuesPromo;
            }

            cliente.setPuntosLealtad(puntosDisponibles - descuentoPuntos.intValue());
        }

        BigDecimal descuentoTotal = descuentoPromo.add(descuentoPuntos);
        BigDecimal total = subtotalTotal.subtract(descuentoTotal).max(BigDecimal.ZERO);

        int puntosGanados = total.divide(new BigDecimal(100), RoundingMode.FLOOR).intValue();
        cliente.setPuntosLealtad(cliente.getPuntosLealtad() + puntosGanados);
        usuarioRepository.save(cliente);

        orden.setSubtotal(subtotalTotal);
        orden.setMontoDescuento(descuentoTotal);
        orden.setCodigoPromoAplicado(codigoPromoAplicado);
        orden.setTotal(total);
        orden = ordenRepository.save(orden);

        return OrdenMapper.toDTO(orden, detalles);
    }

    @Transactional(readOnly = true)
    public OrdenPreviewDTO previsualizarOrden(OrdenRequestDTO request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        Usuario cliente;
        if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
            cliente = usuarioRepository.findByCorreo(auth.getName())
                    .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        } else {
            cliente = usuarioRepository.findById(1L)
                    .orElseThrow(() -> new RuntimeException("No se pudo identificar al cliente invitado"));
        }

        BigDecimal subtotalTotal = BigDecimal.ZERO;

        for (DetalleOrdenRequestDTO det : request.getDetalles()) {
            Platillo platillo = platilloRepository.findById(det.getPlatilloId())
                    .orElseThrow(() -> new RuntimeException("Platillo no encontrado"));

            if ("AGOTADO".equalsIgnoreCase(platillo.getEstado())
                    || "INACTIVO".equalsIgnoreCase(platillo.getEstado())) {
                throw new RuntimeException("El platillo se encuentra agotado: " + platillo.getNombre());
            }

            BigDecimal precio = platillo.getPrecio();
            BigDecimal subtotal = precio.multiply(BigDecimal.valueOf(det.getCantidad()));
            subtotalTotal = subtotalTotal.add(subtotal);
        }

        BigDecimal descuentoPromo = BigDecimal.ZERO;
        String codigoPromoAplicado = null;
        String tituloPromoAplicada = null;

        Promocion promoAutomatica = promocionService.obtenerMejorPromocionAutomatica(subtotalTotal);
        if (promoAutomatica != null) {
            descuentoPromo = promocionService.calcularDescuento(promoAutomatica, subtotalTotal);
            codigoPromoAplicado = promoAutomatica.getCodigoPromo();
            tituloPromoAplicada = promoAutomatica.getTitulo();
        }

        BigDecimal subtotalDespuesPromo = subtotalTotal.subtract(descuentoPromo).max(BigDecimal.ZERO);

        BigDecimal descuentoPuntos = BigDecimal.ZERO;
        if (Boolean.TRUE.equals(request.getUsarPuntos())) {
            int puntosDisponibles = cliente.getPuntosLealtad();
            descuentoPuntos = new BigDecimal(puntosDisponibles);

            if (descuentoPuntos.compareTo(subtotalDespuesPromo) > 0) {
                descuentoPuntos = subtotalDespuesPromo;
            }
        }

        BigDecimal descuentoTotal = descuentoPromo.add(descuentoPuntos);
        BigDecimal total = subtotalTotal.subtract(descuentoTotal).max(BigDecimal.ZERO);
        int puntosGanados = total.divide(new BigDecimal(100), RoundingMode.FLOOR).intValue();

        return new OrdenPreviewDTO(
                subtotalTotal,
                descuentoPromo,
                descuentoPuntos,
                descuentoTotal,
                codigoPromoAplicado,
                tituloPromoAplicada,
                total,
                puntosGanados
        );
    }

    @Transactional(readOnly = true)
    public List<Orden> obtenerActivas() {
        return ordenRepository.findByEstadoPreparacionNotIn(
                List.of(
                        EstadoOrden.ENTREGADA,
                        EstadoOrden.CERRADA,
                        EstadoOrden.CANCELADA
                )
        );
    }

    @Transactional(readOnly = true)
    public OrdenResponseDTO obtenerPorId(Long id) {
        Orden orden = ordenRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada"));

        List<DetalleOrden> detalles = detalleRepository.findByOrdenId(id);

        return OrdenMapper.toDTO(orden, detalles);
    }

    @Transactional(readOnly = true)
    public List<OrdenResponseDTO> obtenerOrdenesDelClienteActual(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("No autenticado");
        }

        Usuario cliente = usuarioRepository.findByCorreo(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        return ordenRepository.findByClienteIdOrderByIdDesc(cliente.getId()).stream()
                .map(orden -> {
                    List<DetalleOrden> detalles = detalleRepository.findByOrdenId(orden.getId());
                    return OrdenMapper.toDTO(orden, detalles);
                })
                .toList();
    }
}
