package com.integradora.back.model.meseromesa;

import com.integradora.back.model.mesa.Mesa;
import com.integradora.back.model.usuario.Usuario;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "MESERO_MESAS")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MeseroMesa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_mesero", nullable = false)
    private Usuario mesero;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_mesa", nullable = false)
    private Mesa mesa;

    @Column(name = "fecha_asignacion", insertable = false, updatable = false)
    private LocalDateTime fechaAsignacion;
}
