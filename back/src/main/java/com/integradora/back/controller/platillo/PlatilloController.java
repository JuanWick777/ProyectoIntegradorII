package com.integradora.back.controller.platillo;

import com.integradora.back.controller.platillo.dto.PlatilloResponseDTO;
import com.integradora.back.service.PlatilloService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/platillos")
@RequiredArgsConstructor
public class PlatilloController {

    private final PlatilloService service;

    @GetMapping
    public List<PlatilloResponseDTO> listar() {
        return service.listar().stream()
                .map(PlatilloResponseDTO::from)
                .toList();
    }
}
