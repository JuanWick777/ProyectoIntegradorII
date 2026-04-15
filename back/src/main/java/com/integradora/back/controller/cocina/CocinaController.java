package com.integradora.back.controller.cocina;

import com.integradora.back.controller.cocina.dto.DetalleOrdenKitchenDTO;
import com.integradora.back.model.cocina.Cocina;
import com.integradora.back.model.detalleorden.EstadoDetalle;
import com.integradora.back.repository.CocinaRepository;
import com.integradora.back.repository.DetalleOrdenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cocina")
@RequiredArgsConstructor
public class CocinaController {

    private final CocinaRepository cocinaRepository;
    private final DetalleOrdenRepository detalleOrdenRepository;

    @GetMapping
    public List<Cocina> listar() {
        return cocinaRepository.findAll();
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

    @GetMapping("/tickets/{cocinaId}")
    public List<DetalleOrdenKitchenDTO> ticketsPorCocina(@PathVariable Long cocinaId) {
        return detalleOrdenRepository.findByCocinaIdAndEstadoPreparacionIn(
                cocinaId,
                List.of(EstadoDetalle.PENDIENTE, EstadoDetalle.EN_PREPARACION)
        ).stream().map(DetalleOrdenKitchenDTO::from).toList();
    }
}
