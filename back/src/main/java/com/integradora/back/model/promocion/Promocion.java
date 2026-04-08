package com.integradora.back.model.promocion;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "PROMOCIONES")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Promocion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "titulo", nullable = false)
    private String titulo;

    @Column(name = "descripcion")
    private String descripcion;

    /**
     * PORCENTAJE  → descuento en % (ej. 10 = 10%)
     * MONTO_FIJO  → descuento en pesos fijos (ej. 50 = $50 off)
     */
    @Column(name = "tipo_descuento", nullable = false)
    private String tipoDescuento;

    @Column(name = "valor_descuento", precision = 10, scale = 2, nullable = false)
    private BigDecimal valorDescuento;

    /** Código que el cliente o mesero ingresan (nullable = sin código, aplica automáticamente) */
    @Column(name = "codigo_promo", unique = true)
    private String codigoPromo;

    @Builder.Default
    @Column(name = "activa")
    private Boolean activa = true;

    @Column(name = "fecha_inicio")
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDate fechaFin;
}
