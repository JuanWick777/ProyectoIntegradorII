package com.integradora.back.model.platillo;

import com.integradora.back.model.categoria.Categoria;
import com.integradora.back.model.cocina.Cocina;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "PLATILLOS")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Platillo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "descripcion")
    private String descripcion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_categoria")
    private Categoria categoria;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "kitchen_id")
    private Cocina cocina;

    @Column(name = "precio", precision = 10, scale = 2)
    private BigDecimal precio;

    @Builder.Default
    @Column(name = "stock")
    private Integer stock = 0;

    @Column(name = "url_imagen")
    private String urlImagen;

    @Builder.Default
    @Column(name = "estado")
    private String estado = "ACTIVO";
}