package com.integradora.back.model.mesa;

import com.integradora.back.model.orden.Orden;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

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

    @Column(name = "capacidad", nullable = false)
    private Integer capacidad;

    @Column(name = "estado")
    private String estado;

    @Builder.Default
    @Column(name = "cuenta_abierta")
    private Integer cuentaAbierta = 0;

    @Builder.Default
    @Column(name = "qr_activo")
    private Integer qrActivo = 1;

    @Column(name = "fecha_apertura_cuenta")
    private LocalDateTime fechaAperturaCuenta;

    @Column(name = "fecha_cierre_cuenta")
    private LocalDateTime fechaCierreCuenta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_orden_activa")
    private Orden ordenActiva;
}
