package proyecto.personal.proyectointegradorii.data.local

import android.content.Context
import proyecto.personal.proyectointegradorii.data.remote.network.SessionManager

object AppStateCleaner {
    fun clearAll(context: Context) {
        SessionManager.clear(context)
        CartStateStorage.clear(context)
    }
}
