package com.integradora.back.service;

import com.integradora.back.controller.detalleorden.dto.DetalleOrdenRequestDTO;
import com.integradora.back.controller.orden.OrdenMapper;
import com.integradora.back.controller.orden.dto.OrdenPreviewDTO;
import com.integradora.back.controller.orden.dto.OrdenRequestDTO;
import com.integradora.back.controller.orden.dto.OrdenResponseDTO;
import com.integradora.back.model.detalleorden.DetalleOrden;
import com.integradora.back.model.detalleorden.EstadoDetalle;
import com.integradora.back.model.mesa.Mesa;
import com.integradora.back.model.orden.EstadoOrden;
import com.integradora.back.model.orden.Orden;
import com.integradora.back.model.platillo.Platillo;
import com.integradora.back.model.promocion.Promocion;
import com.integradora.back.model.usuario.Usuario;
import com.integradora.back.repository.DetalleOrdenRepository;
import com.integradora.back.repository.MesaRepository;
import com.integradora.back.repository.MeseroMesaRepository;
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
import java.util.Collection;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrdenService {

    private static final int MAX_ARTICULOS_POR_PEDIDO = 20;

    private final OrdenRepository ordenRepository;
    private final UsuarioRepository usuarioRepository;
    private final MesaRepository mesaRepository;
    private final PlatilloRepository platilloRepository;
    private final DetalleOrdenRepository detalleRepository;
    private final PromocionService promocionService;
    private final MeseroMesaRepository meseroMesaRepository;
    private final AuditLogService auditLogService;

    @Transactional
    public Orden actualizarEstado(Long ordenId, String estado, String motivo, boolean confirmarCancelacionCocina) {
        Orden orden = ordenRepository.findById(ordenId)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada"));

        EstadoOrden nuevoEstado;
        try {
            nuevoEstado = EstadoOrden.valueOf(estado.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Estado inválido: " + estado);
        }

        Authentication authActual = SecurityContextHolder.getContext().getAuthentication();
        if (authActual != null && authActual.isAuthenticated() && !authActual.getName().equals("anonymousUser")) {
            Usuario usuarioActual = usuarioRepository.findByCorreo(authActual.getName()).orElse(null);
            boolean esMesero = usuarioActual != null
                    && usuarioActual.getRolEspecifico() != null
                    && usuarioActual.getRolEspecifico().equalsIgnoreCase("MESERO");

            if (esMesero) {
                if (!List.of(EstadoOrden.CONFIRMADA, EstadoOrden.CANCELADA, EstadoOrden.ENTREGADA, EstadoOrden.CERRADA).contains(nuevoEstado)) {
                    throw new RuntimeException("El mesero no puede cambiar la orden a este estado.");
                }

                Long mesaId = orden.getMesa() != null ? orden.getMesa().getId() : null;
                if (mesaId == null || !meseroMesaRepository.existsByMeseroIdAndMesaId(usuarioActual.getId(), mesaId)) {
                    throw new RuntimeException("No puedes modificar pedidos de una mesa que no tienes asignada.");
                }

                if (nuevoEstado == EstadoOrden.CANCELADA) {
                    if (motivo == null || motivo.isBlank()) {
                        throw new RuntimeException("Debes escribir un motivo para cancelar la orden.");
                    }

                    List<DetalleOrden> detalles = detalleRepository.findByOrdenId(ordenId);
                    boolean requiereConfirmacionCocina = detalles.stream()
                            .map(DetalleOrden::getEstadoPreparacion)
                            .anyMatch(estadoDetalle ->
                                    estadoDetalle == EstadoDetalle.EN_PREPARACION || estadoDetalle == EstadoDetalle.LISTO
                            );

                    if (requiereConfirmacionCocina && !confirmarCancelacionCocina) {
                        throw new RuntimeException("Algunos platillos ya estan en preparacion o listos. Confirma con cocina antes de cancelar.");
                    }

                    orden.setMotivoCancelacion(motivo.trim());
                    orden.setCanceladaPor(usuarioActual);
                    orden.setFechaCancelacion(LocalDateTime.now());
                    auditLogService.registrarCancelacionOrden(orden, usuarioActual, motivo.trim());
                }

                if (nuevoEstado == EstadoOrden.ENTREGADA && orden.getEstadoPreparacion() != EstadoOrden.LISTA) {
                    throw new RuntimeException("Solo puedes marcar una orden como entregada si ya esta lista.");
                }

                if (nuevoEstado == EstadoOrden.CERRADA) {
                    if (orden.getEstadoPreparacion() != EstadoOrden.ENTREGADA) {
                        throw new RuntimeException("Solo puedes cerrar una mesa si la orden ya fue entregada.");
                    }

                    cerrarMesaSiProcede(orden);
                    return orden;
                }
            }
        }

        orden.setEstadoPreparacion(nuevoEstado);

        if (nuevoEstado == EstadoOrden.ENTREGADA
                || nuevoEstado == EstadoOrden.CANCELADA
                || nuevoEstado == EstadoOrden.CERRADA) {
            orden.setFechaFinalizacion(LocalDateTime.now());
        }

        if (nuevoEstado != EstadoOrden.CANCELADA) {
            orden.setMotivoCancelacion(null);
            orden.setCanceladaPor(null);
            orden.setFechaCancelacion(null);
        }

        if (estado.equalsIgnoreCase("confirmada")) {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
                Usuario meseroActual = usuarioRepository.findByCorreo(auth.getName())
                        .orElseThrow(() -> new RuntimeException("Mesero no encontrado"));

                Long mesaId = orden.getMesa() != null ? orden.getMesa().getId() : null;
                if (mesaId == null || !meseroMesaRepository.existsByMeseroIdAndMesaId(meseroActual.getId(), mesaId)) {
                    throw new RuntimeException("No puedes tomar pedidos de una mesa que no tienes asignada.");
                }

                if (orden.getMesero() == null || !orden.getMesero().getId().equals(meseroActual.getId())) {
                    orden.setMesero(meseroActual);
                }
            }

            List<DetalleOrden> detalles = detalleRepository.findByOrdenId(ordenId);
            for (DetalleOrden d : detalles) {
                d.setEstadoPreparacion(EstadoDetalle.PENDIENTE);
            }
            detalleRepository.saveAll(detalles);
        }

        orden = ordenRepository.save(orden);

        if (nuevoEstado == EstadoOrden.CANCELADA) {
            liberarMesaSiYaNoTieneOrdenesActivas(orden.getMesa());
        }

        return orden;
    }

    @Transactional
    public OrdenResponseDTO crearOrdenCompleta(OrdenRequestDTO request) {
        validarLimiteArticulos(request);
        Usuario cliente = obtenerClienteActualOpcional();

        var mesa = mesaRepository.findByNumero(request.getMesaId().intValue())
                .orElseThrow(() -> new RuntimeException("Mesa no encontrada con el numero: " + request.getMesaId()));

        if (mesa.getQrActivo() != null && mesa.getQrActivo() == 0) {
            throw new RuntimeException("El QR de esta mesa no esta disponible en este momento.");
        }

        if ("INACTIVA".equalsIgnoreCase(mesa.getEstado())) {
            throw new RuntimeException("La mesa no esta disponible en este momento.");
        }

        Orden orden = Orden.builder()
                .cliente(cliente)
                .mesa(mesa)
                .estadoPreparacion(EstadoOrden.PENDIENTE_CONFIRMACION)
                .fechaCreacion(LocalDateTime.now())
                .build();

        if (cliente != null && "MESERO".equals(cliente.getRolEspecifico())) {
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
        if (cliente != null && Boolean.TRUE.equals(request.getUsarPuntos())) {
            int puntosDisponibles = cliente.getPuntosLealtad();
            descuentoPuntos = new BigDecimal(puntosDisponibles);

            if (descuentoPuntos.compareTo(subtotalDespuesPromo) > 0) {
                descuentoPuntos = subtotalDespuesPromo;
            }

            cliente.setPuntosLealtad(puntosDisponibles - descuentoPuntos.intValue());
        }

        BigDecimal descuentoTotal = descuentoPromo.add(descuentoPuntos);
        BigDecimal total = subtotalTotal.subtract(descuentoTotal).max(BigDecimal.ZERO);

        if (cliente != null) {
            int puntosGanados = total.divide(new BigDecimal(100), RoundingMode.FLOOR).intValue();
            cliente.setPuntosLealtad(cliente.getPuntosLealtad() + puntosGanados);
            usuarioRepository.save(cliente);
        }

        orden.setSubtotal(subtotalTotal);
        orden.setMontoDescuento(descuentoTotal);
        orden.setCodigoPromoAplicado(codigoPromoAplicado);
        orden.setTotal(total);
        orden = ordenRepository.save(orden);
        abrirCuentaMesaSiEsNecesario(mesa, orden);

        return OrdenMapper.toDTO(orden, detalles);
    }

    @Transactional(readOnly = true)
    public OrdenPreviewDTO previsualizarOrden(OrdenRequestDTO request) {
        validarLimiteArticulos(request);
        Usuario cliente = obtenerClienteActualOpcional();

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
        if (cliente != null && Boolean.TRUE.equals(request.getUsarPuntos())) {
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
        validarAccesoALaOrden(orden);

        List<DetalleOrden> detalles = detalleRepository.findByOrdenId(id);

        return OrdenMapper.toDTO(orden, detalles);
    }

    @Transactional(readOnly = true)
    public List<OrdenResponseDTO> obtenerActivasPorMesa(Integer numeroMesa) {
        return ordenRepository.findByMesaNumeroAndEstadoPreparacionNotInOrderByIdDesc(
                        numeroMesa,
                        List.of(
                                EstadoOrden.ENTREGADA,
                                EstadoOrden.CERRADA,
                                EstadoOrden.CANCELADA
                        )
                )
                .stream()
                .map(orden -> {
                    List<DetalleOrden> detalles = detalleRepository.findByOrdenId(orden.getId());
                    return OrdenMapper.toDTO(orden, detalles);
                })
                .toList();
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

    private Usuario obtenerClienteActualOpcional() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
            return null;
        }

        return usuarioRepository.findByCorreo(auth.getName())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
    }

    private void validarAccesoALaOrden(Orden orden) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
            throw new RuntimeException("No autenticado");
        }

        Usuario usuarioActual = usuarioRepository.findByCorreo(auth.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (tieneAlgunoDeLosRoles(auth, "ROLE_ADMIN", "ROLE_CHEF", "ROLE_COCINERO", "ROLE_PARRILLERO", "ROLE_BARISTA", "ROLE_REPOSTERO")) {
            return;
        }

        if (tieneAlgunoDeLosRoles(auth, "ROLE_CLIENTE")) {
            Long clienteId = orden.getCliente() != null ? orden.getCliente().getId() : null;
            if (clienteId != null && clienteId.equals(usuarioActual.getId())) {
                return;
            }
            throw new RuntimeException("No puedes ver una orden que no te pertenece");
        }

        if (tieneAlgunoDeLosRoles(auth, "ROLE_MESERO")) {
            Long mesaId = orden.getMesa() != null ? orden.getMesa().getId() : null;
            if (mesaId != null && meseroMesaRepository.existsByMeseroIdAndMesaId(usuarioActual.getId(), mesaId)) {
                return;
            }
            throw new RuntimeException("No puedes ver pedidos de una mesa que no tienes asignada");
        }

        throw new RuntimeException("No tienes permisos para ver esta orden");
    }

    private boolean tieneAlgunoDeLosRoles(Authentication auth, String... roles) {
        Collection<?> authorities = auth.getAuthorities();
        if (authorities == null) {
            return false;
        }

        return auth.getAuthorities().stream()
                .map(a -> a.getAuthority())
                .anyMatch(authority -> List.of(roles).contains(authority));
    }

    private void validarLimiteArticulos(OrdenRequestDTO request) {
        if (request == null || request.getDetalles() == null || request.getDetalles().isEmpty()) {
            throw new RuntimeException("Debes agregar al menos un platillo al pedido.");
        }

        int totalArticulos = request.getDetalles().stream()
                .mapToInt(detalle -> detalle.getCantidad() != null ? detalle.getCantidad() : 0)
                .sum();

        if (totalArticulos > MAX_ARTICULOS_POR_PEDIDO) {
            throw new RuntimeException("El pedido no puede superar 20 articulos en total.");
        }
    }

    private void abrirCuentaMesaSiEsNecesario(Mesa mesa, Orden orden) {
        if (mesa == null) {
            return;
        }

        if (mesa.getCuentaAbierta() == null || mesa.getCuentaAbierta() == 0) {
            mesa.setCuentaAbierta(1);
            mesa.setFechaAperturaCuenta(LocalDateTime.now());
        }

        mesa.setFechaCierreCuenta(null);
        mesa.setEstado("OCUPADA");
        mesa.setOrdenActiva(orden);
        mesaRepository.save(mesa);
    }

    private void cerrarMesaSiProcede(Orden ordenBase) {
        Mesa mesa = ordenBase.getMesa();
        if (mesa == null || mesa.getId() == null) {
            throw new RuntimeException("La orden no tiene una mesa asociada.");
        }

        List<Orden> ordenesMesa = ordenRepository.findByMesaIdOrderByIdDesc(mesa.getId());

        boolean hayPendientes = ordenesMesa.stream()
                .anyMatch(orden -> List.of(
                        EstadoOrden.PENDIENTE_CONFIRMACION,
                        EstadoOrden.CONFIRMADA,
                        EstadoOrden.EN_PREPARACION,
                        EstadoOrden.LISTA
                ).contains(orden.getEstadoPreparacion()));

        if (hayPendientes) {
            throw new RuntimeException("No se puede cerrar la mesa porque aun hay pedidos o platillos pendientes.");
        }

        List<Orden> ordenesEntregadas = ordenesMesa.stream()
                .filter(orden -> orden.getEstadoPreparacion() == EstadoOrden.ENTREGADA)
                .toList();

        if (ordenesEntregadas.isEmpty()) {
            throw new RuntimeException("No hay ordenes entregadas pendientes de cierre en esta mesa.");
        }

        LocalDateTime ahora = LocalDateTime.now();
        ordenesEntregadas.forEach(orden -> {
            orden.setEstadoPreparacion(EstadoOrden.CERRADA);
            orden.setFechaFinalizacion(ahora);
        });
        ordenRepository.saveAll(ordenesEntregadas);

        mesa.setCuentaAbierta(0);
        mesa.setEstado("LIBRE");
        mesa.setFechaCierreCuenta(ahora);
        mesa.setOrdenActiva(null);
        mesaRepository.save(mesa);

        ordenBase.setEstadoPreparacion(EstadoOrden.CERRADA);
        ordenBase.setFechaFinalizacion(ahora);
    }

    private void liberarMesaSiYaNoTieneOrdenesActivas(Mesa mesa) {
        if (mesa == null || mesa.getId() == null) {
            return;
        }

        boolean quedanActivas = ordenRepository.findByMesaIdOrderByIdDesc(mesa.getId()).stream()
                .anyMatch(orden -> List.of(
                        EstadoOrden.PENDIENTE_CONFIRMACION,
                        EstadoOrden.CONFIRMADA,
                        EstadoOrden.EN_PREPARACION,
                        EstadoOrden.LISTA,
                        EstadoOrden.ENTREGADA
                ).contains(orden.getEstadoPreparacion()));

        if (!quedanActivas) {
            mesa.setCuentaAbierta(0);
            mesa.setEstado("LIBRE");
            mesa.setFechaCierreCuenta(LocalDateTime.now());
            mesa.setOrdenActiva(null);
            mesaRepository.save(mesa);
        }
    }
}
