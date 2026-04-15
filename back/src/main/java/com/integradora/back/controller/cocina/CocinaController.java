package com.integradora.back.controller.cocina;

import com.integradora.back.controller.cocina.dto.DetalleOrdenKitchenDTO;
import com.integradora.back.repository.DetalleOrdenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cocina")
@RequiredArgsConstructor
public class CocinaController {

    private final DetalleOrdenRepository detalleOrdenRepository;

    @GetMapping
    public List<Map<String, Object>> listar() {
        return List.of();
    }

    @GetMapping("/tickets")
    public List<DetalleOrdenKitchenDTO> tickets() {
        return detalleOrdenRepository.findTicketsCocina().stream()
                .map(DetalleOrdenKitchenDTO::from)
                .toList();
    }

    @GetMapping("/historial")
    public List<DetalleOrdenKitchenDTO> historial() {
        return detalleOrdenRepository.findHistorialCocina().stream()
                .map(DetalleOrdenKitchenDTO::from)
                .toList();
    }
}
