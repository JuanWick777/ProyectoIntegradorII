package com.integradora.back.controller.admin;

import com.integradora.back.controller.usuario.dto.UsuarioRequestDTO;
import com.integradora.back.controller.usuario.dto.UsuarioResponseDTO;
import com.integradora.back.model.brigada.Brigada;
import com.integradora.back.model.usuario.Usuario;
import com.integradora.back.repository.BrigadaRepository;
import com.integradora.back.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AdminController {

    private final UsuarioRepository usuarioRepository;
    private final BrigadaRepository brigadaRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/usuarios")
    public List<UsuarioResponseDTO> listarUsuarios() {
        return usuarioRepository.findAll()
                .stream()
                .map(UsuarioResponseDTO::from)
                .toList();
    }

    @PostMapping("/usuarios")
    public ResponseEntity<UsuarioResponseDTO> crearUsuario(@RequestBody UsuarioRequestDTO req) {
        Usuario usuario = new Usuario();
        usuario.setNombreCompleto(req.getNombre());
        usuario.setCorreo(req.getEmail());
        usuario.setContrasena(passwordEncoder.encode(req.getPassword()));
        usuario.setTipoUsuario("Empleado");
        usuario.setRolEspecifico(req.getRol());
        usuario.setAreaAsignada(req.getEspecialidad());
        usuario.setEstado("ACTIVO");
        usuario.setPuntosLealtad(0);
        usuario.setTurno(null);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(UsuarioResponseDTO.from(usuarioRepository.save(usuario)));
    }

    @PutMapping("/usuarios/{id}")
    public UsuarioResponseDTO actualizarUsuario(@PathVariable Long id, @RequestBody UsuarioRequestDTO req) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setNombreCompleto(req.getNombre());
        usuario.setCorreo(req.getEmail());
        usuario.setRolEspecifico(req.getRol());
        usuario.setAreaAsignada(req.getEspecialidad());

        if (req.getPassword() != null && !req.getPassword().isBlank()) {
            usuario.setContrasena(passwordEncoder.encode(req.getPassword()));
        }

        return UsuarioResponseDTO.from(usuarioRepository.save(usuario));
    }

    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {
        usuarioRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/brigadas")
    public List<Brigada> listarBrigadas() {
        return brigadaRepository.findAll();
    }

    @PostMapping("/brigadas")
    public ResponseEntity<Brigada> crearBrigada(@RequestBody Brigada brigada) {
        return ResponseEntity.status(HttpStatus.CREATED).body(brigadaRepository.save(brigada));
    }

    @PutMapping("/brigadas/{id}")
    public Brigada actualizarBrigada(@PathVariable Long id, @RequestBody Brigada req) {
        Brigada brigada = brigadaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Brigada no encontrada"));

        brigada.setNombre(req.getNombre());
        brigada.setDescripcion(req.getDescripcion());
        brigada.setMesaDesde(req.getMesaDesde());
        brigada.setMesaHasta(req.getMesaHasta());

        return brigadaRepository.save(brigada);
    }

    @DeleteMapping("/brigadas/{id}")
    public ResponseEntity<Void> eliminarBrigada(@PathVariable Long id) {
        brigadaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
