package com.integradora.back.controller.mesero;

import com.integradora.back.controller.orden.OrdenMapper;
import com.integradora.back.controller.orden.dto.OrdenResponseDTO;
import com.integradora.back.model.orden.EstadoOrden;
import com.integradora.back.model.orden.Orden;
import com.integradora.back.model.usuario.Usuario;
import com.integradora.back.repository.DetalleOrdenRepository;
import com.integradora.back.repository.MeseroMesaRepository;
import com.integradora.back.repository.OrdenRepository;
import com.integradora.back.repository.UsuarioRepository;
import com.integradora.back.service.OrdenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mesero")
@RequiredArgsConstructor
public class MeseroController {

    private final OrdenService ordenService;
    private final DetalleOrdenRepository detalleOrdenRepository;
    private final UsuarioRepository usuarioRepository;
    private final OrdenRepository ordenRepository;
    private final MeseroMesaRepository meseroMesaRepository;

    @GetMapping("/ordenes")
    public ResponseEntity<List<OrdenResponseDTO>> listarActivas(Authentication auth) {
        List<Orden> ordenes;

        // ADMIN ve todo lo activo. MESERO ve: pendientes + sus órdenes asignadas (máx 3 activas).
        if (auth != null && auth.getAuthorities() != null
                && auth.getAuthorities().stream().anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()))) {
            ordenes = ordenService.obtenerActivas();
        } else {
            String correo = auth != null ? auth.getName() : null;
            Usuario mesero = (correo != null)
                    ? usuarioRepository.findByCorreo(correo).orElseThrow()
                    : null;

            List<Long> mesaIds = (mesero == null)
                    ? List.of()
                    : meseroMesaRepository.findByMeseroIdOrderByMesaNumeroAsc(mesero.getId())
                            .stream()
                            .map(a -> a.getMesa().getId())
                            .toList();

            ordenes = mesaIds.isEmpty()
                    ? List.of()
                    : ordenRepository.findByMesaIdInAndEstadoPreparacionIn(
                            mesaIds,
                            List.of(
                                    EstadoOrden.PENDIENTE_CONFIRMACION,
                                    EstadoOrden.CONFIRMADA,
                                    EstadoOrden.EN_PREPARACION,
                                    EstadoOrden.LISTA,
                                    EstadoOrden.ENTREGADA
                            )
                    );
        }

        List<OrdenResponseDTO> dto = ordenes.stream()
                .map(orden -> OrdenMapper.toDTO(
                        orden,
                        detalleOrdenRepository.findByOrdenId(orden.getId())
                ))
                .toList();

        return ResponseEntity.ok(dto);
    }
}
