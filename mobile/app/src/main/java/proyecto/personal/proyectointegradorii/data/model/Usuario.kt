package proyecto.personal.proyectointegradorii.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "usuarios")
data class Usuario(

    @PrimaryKey(autoGenerate = true)
    val id: Int = 0,

    val nombre_completo: String,
    val correo_electronico: String,
    val contrasena: String,
    val puntos: Int = 0
)