package com.integradora.back.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "MESAS")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Mesa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero", nullable = false)
    private Integer numero;

    @Column(name = "estado")
    private String estado;
}