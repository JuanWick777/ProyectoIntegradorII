package com.integradora.back.controller.admin;

import com.integradora.back.controller.usuario.dto.UsuarioRequestDTO;
import com.integradora.back.controller.usuario.dto.UsuarioResponseDTO;
import com.integradora.back.model.mesa.Mesa;
import com.integradora.back.model.meseromesa.MeseroMesa;
import com.integradora.back.model.usuario.Usuario;
import com.integradora.back.repository.MesaRepository;
import com.integradora.back.repository.MeseroMesaRepository;
import com.integradora.back.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final MesaRepository mesaRepository;
    private final MeseroMesaRepository meseroMesaRepository;

    @GetMapping("/usuarios")
    public List<UsuarioResponseDTO> listarUsuarios() {
        return usuarioRepository.findAll()
                .stream()
                .map(this::toUsuarioResponse)
                .toList();
    }

    @PostMapping("/usuarios")
    @Transactional
    public ResponseEntity<UsuarioResponseDTO> crearUsuario(@RequestBody UsuarioRequestDTO req) {
        Usuario usuario = new Usuario();
        usuario.setNombreCompleto(req.getNombre());
        usuario.setCorreo(req.getEmail());
        usuario.setContrasena(passwordEncoder.encode(req.getPassword()));
        usuario.setTipoUsuario("Empleado");
        usuario.setRolEspecifico(req.getRol().toUpperCase());
        usuario.setEstado("ACTIVO");
        usuario.setPuntosLealtad(0);
        usuario.setFotoPerfil(req.getFotoPerfil());

        Usuario guardado = usuarioRepository.save(usuario);
        guardarAsignacionesMesero(guardado, req.getMesaIds());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(toUsuarioResponse(guardado));
    }

    @PutMapping("/usuarios/{id}")
    @Transactional
    public UsuarioResponseDTO actualizarUsuario(@PathVariable Long id, @RequestBody UsuarioRequestDTO req) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setNombreCompleto(req.getNombre());
        usuario.setCorreo(req.getEmail());
        usuario.setRolEspecifico(req.getRol() != null ? req.getRol().toUpperCase() : null);
        usuario.setFotoPerfil(req.getFotoPerfil());

        if (req.getPassword() != null && !req.getPassword().isBlank()) {
            usuario.setContrasena(passwordEncoder.encode(req.getPassword()));
        }

        Usuario guardado = usuarioRepository.save(usuario);
        guardarAsignacionesMesero(guardado, req.getMesaIds());
        return toUsuarioResponse(guardado);
    }

    @DeleteMapping("/usuarios/{id}")
    @Transactional
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {
        if (id == 1L) {
            throw new RuntimeException("Acción denegada: No se puede eliminar al Super Administrador principal.");
        }
        meseroMesaRepository.deleteByMeseroId(id);
        usuarioRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private UsuarioResponseDTO toUsuarioResponse(Usuario usuario) {
        List<MeseroMesa> asignaciones = meseroMesaRepository.findByMeseroIdOrderByMesaNumeroAsc(usuario.getId());
        List<Long> mesaIds = asignaciones.stream()
                .map(a -> a.getMesa().getId())
                .toList();
        List<Integer> mesasAsignadas = asignaciones.stream()
                .map(a -> a.getMesa().getNumero())
                .toList();

        return UsuarioResponseDTO.from(usuario, mesaIds, mesasAsignadas);
    }

    private void guardarAsignacionesMesero(Usuario usuario, List<Long> mesaIds) {
        String rol = usuario.getRolEspecifico();
        boolean esMesero = rol != null && rol.equalsIgnoreCase("MESERO");

        meseroMesaRepository.deleteByMeseroId(usuario.getId());

        if (!esMesero) {
            return;
        }

        if (mesaIds == null || mesaIds.isEmpty()) {
            throw new RuntimeException("Un mesero debe tener asignadas entre 1 y 3 mesas.");
        }

        List<Long> idsUnicos = mesaIds.stream()
                .filter(id -> id != null && id > 0)
                .distinct()
                .toList();

        if (idsUnicos.isEmpty() || idsUnicos.size() > 3) {
            throw new RuntimeException("Un mesero debe tener asignadas entre 1 y 3 mesas.");
        }

        List<Mesa> mesas = mesaRepository.findAllById(idsUnicos);
        if (mesas.size() != idsUnicos.size()) {
            throw new RuntimeException("Una o más mesas asignadas no existen.");
        }

        for (Long mesaId : idsUnicos) {
            if (meseroMesaRepository.existsByMesaIdAndMeseroIdNot(mesaId, usuario.getId())) {
                throw new RuntimeException("La mesa " + mesaId + " ya está asignada a otro mesero.");
            }
        }

        List<MeseroMesa> asignaciones = mesas.stream()
                .map(mesa -> MeseroMesa.builder()
                        .mesero(usuario)
                        .mesa(mesa)
                        .build())
                .toList();

        meseroMesaRepository.saveAll(asignaciones);
    }
}
