package com.integradora.back.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "CATEGORIAS")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre", nullable = false)
    private String nombre;
}