package com.restaurante.api.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

/**
 * Tabla usuarios: id, nombre, email, password_hash, rol, especialidad,
 * brigada_id, activo, created_at
 */
@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Rol rol;

    /**
     * Especialidad del cocinero: parrillero, barista, repostero, chef, etc.
     * Solo aplica cuando rol = cocinero. Texto libre para flexibilidad.
     */
    @Column(length = 80)
    private String especialidad;

    /**
     * Brigada a la que pertenece este usuario (principalmente cocineros).
     * Define qué rango de mesas atiende.
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "brigada_id")
    private Brigada brigada;

    /**
     * Mesa asignada al mesero (solo aplica cuando rol = mesero).
     */
    @Column(name = "mesa_id")
    private Integer mesaId;

    @Column(nullable = false)
    private Boolean activo = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum Rol {
        admin, mesero, cocinero, chef, barista
    }
}
