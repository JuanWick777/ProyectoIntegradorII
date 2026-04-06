package com.integradora.back.controller.cocina;

import com.integradora.back.model.detalleorden.DetalleOrden;
import com.integradora.back.repository.DetalleOrdenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cocina")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class CocinaController {

    private final DetalleOrdenRepository repository;

    @GetMapping("/tickets")
    public List<DetalleOrden> tickets() {
        return repository.findTicketsCocina();
    }
}
