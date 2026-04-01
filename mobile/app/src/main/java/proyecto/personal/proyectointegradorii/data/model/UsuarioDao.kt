package proyecto.personal.proyectointegradorii.data.model

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query

@Dao
interface UsuarioDao {

    @Insert
    suspend fun insertar(usuario: Usuario)

    @Query("SELECT * FROM usuarios WHERE correo_electronico = :correo AND contrasena = :password")
    suspend fun login(correo: String, password: String): Usuario?

    @Query("SELECT * FROM usuarios WHERE correo_electronico = :correo")
    suspend fun buscarPorCorreo(correo: String): Usuario?
}