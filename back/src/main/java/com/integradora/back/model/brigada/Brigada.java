package com.integradora.back.model.brigada;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "BRIGADAS")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Brigada {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "mesa_desde", nullable = false)
    private Integer mesaDesde;

    @Column(name = "mesa_hasta", nullable = false)
    private Integer mesaHasta;
}
