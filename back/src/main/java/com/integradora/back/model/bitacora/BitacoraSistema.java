package com.integradora.back.model.bitacora;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "BITACORA_SISTEMA")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BitacoraSistema {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tabla_afectada")
    private String tablaAfectada;

    @Column(name = "accion")
    private String accion;

    @Column(name = "usuario_id")
    private Long usuarioId;

    @Column(name = "fecha")
    private LocalDateTime fecha;

    @Column(name = "descripcion")
    private String descripcion;
}
