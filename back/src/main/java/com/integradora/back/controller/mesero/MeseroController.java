package com.integradora.back.controller.mesero;

import com.integradora.back.controller.orden.OrdenMapper;
import com.integradora.back.controller.orden.dto.OrdenResponseDTO;
import com.integradora.back.model.orden.EstadoOrden;
import com.integradora.back.model.orden.Orden;
import com.integradora.back.model.usuario.Usuario;
import com.integradora.back.repository.DetalleOrdenRepository;
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
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class MeseroController {

    private final OrdenService ordenService;
    private final DetalleOrdenRepository detalleOrdenRepository;
    private final UsuarioRepository usuarioRepository;
    private final OrdenRepository ordenRepository;

    @GetMapping("/ordenes")
    public ResponseEntity<List<OrdenResponseDTO>> listarActivas() {
        List<OrdenResponseDTO> ordenes = ordenService.obtenerActivas()
                .stream()
                .map(orden -> OrdenMapper.toDTO(
                        orden,
                        detalleOrdenRepository.findByOrdenId(orden.getId())
                ))
                .toList();

        return ResponseEntity.ok(ordenes);
    }

    /*@GetMapping("/mesero")
    public List<Orden> porMesero(Authentication auth) {
        String correo = auth.getName();
        Usuario mesero = usuarioRepository.findByCorreo(correo).orElseThrow();

        return ordenRepository.findByMeseroIdAndEstadoPreparacionNotIn(
                mesero.getId(),
                List.of(EstadoOrden.CERRADA, EstadoOrden.CANCELADA)
        );
    }*/
}
