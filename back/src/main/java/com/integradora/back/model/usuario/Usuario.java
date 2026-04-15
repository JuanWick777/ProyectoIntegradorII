package com.integradora.back.model.usuario;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "USUARIOS")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "nombre_completo", nullable = false)
    private String nombreCompleto;

    @Column(name = "correo", nullable = false, unique = true)
    private String correo;

    @Column(name = "contrasena", nullable = false)
    private String contrasena;

    @Column(name = "tipo_usuario")
    private String tipoUsuario;

    @Column(name = "rol_especifico")
    private String rolEspecifico;

    @Column(name = "puntos_lealtad")
    private Integer puntosLealtad;

    @Column(name = "estado")
    private String estado;

    @Column(name = "fecha_registro", insertable = false, updatable = false)
    private LocalDateTime fechaRegistro;

    @Column(name = "foto_perfil")
    private String fotoPerfil;

    @Column(name = "codigo_recuperacion")
    private String codigoRecuperacion;

    @Column(name = "expiracion_codigo")
    private LocalDateTime expiracionCodigo;
}
