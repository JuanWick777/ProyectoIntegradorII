package com.integradora.back.controller.mesero;

import com.integradora.back.controller.orden.OrdenMapper;
import com.integradora.back.controller.orden.dto.OrdenResponseDTO;
import com.integradora.back.model.orden.Orden;
import com.integradora.back.repository.DetalleOrdenRepository;
import com.integradora.back.service.OrdenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mesero")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class MeseroController {

    private final OrdenService ordenService;
    private final DetalleOrdenRepository detalleOrdenRepository;

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
}
