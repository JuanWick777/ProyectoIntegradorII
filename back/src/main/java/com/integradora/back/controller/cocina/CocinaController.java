package com.integradora.back.controller.cocina;

import com.integradora.back.controller.cocina.dto.TicketCocinaDTO;
import com.integradora.back.model.detalleorden.DetalleOrden;
import com.integradora.back.model.detalleorden.EstadoDetalle;
import com.integradora.back.repository.DetalleOrdenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cocina")
@RequiredArgsConstructor
public class CocinaController {

    private final DetalleOrdenRepository detalleOrdenRepository;

    @GetMapping("/tickets")
    public List<TicketCocinaDTO> tickets() {
        // Solo tickets de órdenes activas (excluye entregadas/cerradas/canceladas)
        return detalleOrdenRepository.findTicketsCocina().stream().map(TicketCocinaDTO::from).toList();
    }

    @GetMapping("/historial")
    public List<TicketCocinaDTO> historial() {
        return detalleOrdenRepository.findHistorialCocina().stream().map(TicketCocinaDTO::from).toList();
    }

    @GetMapping("/tickets/{cocinaId}")
    public List<TicketCocinaDTO> ticketsPorCocina(@PathVariable Long cocinaId) {
        return detalleOrdenRepository.findByCocinaIdAndEstadoPreparacionIn(
                cocinaId,
                List.of(
                        EstadoDetalle.PENDIENTE,
                        EstadoDetalle.EN_PREPARACION
                )
        ).stream().map(TicketCocinaDTO::from).toList();
    }
}