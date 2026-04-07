package com.integradora.back.model.cocina;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "COCINAS")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cocina {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;
}
