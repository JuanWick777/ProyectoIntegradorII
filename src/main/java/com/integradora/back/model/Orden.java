package com.integradora.back.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ORDENES")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Orden {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // CLIENTE
    @ManyToOne
    @JoinColumn(name = "id_cliente")
    private Usuario cliente;

    // MESERO
    @ManyToOne
    @JoinColumn(name = "id_mesero")
    private Usuario mesero;

    // COCINERO
    @ManyToOne
    @JoinColumn(name = "id_cocinero")
    private Usuario cocinero;

    // MESA
    @ManyToOne
    @JoinColumn(name = "id_mesa")
    private Mesa mesa;

    @Column(name = "estado_preparacion")
    private String estadoPreparacion;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_finalizacion")
    private LocalDateTime fechaFinalizacion;
}