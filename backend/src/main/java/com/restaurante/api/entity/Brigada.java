package com.restaurante.api.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Tabla brigadas: equipos de cocineros que cubren un rango de mesas.
 * Permite distribuir la carga de trabajo y evitar confusiones en pedidos.
 */
@Entity
@Table(name = "brigadas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Brigada {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(length = 255)
    private String descripcion;

    /** Mesa inicial del rango que cubre esta brigada */
    @Column(name = "mesa_desde", nullable = false)
    private Integer mesaDesde = 1;

    /** Mesa final del rango que cubre esta brigada */
    @Column(name = "mesa_hasta", nullable = false)
    private Integer mesaHasta = 5;
}
