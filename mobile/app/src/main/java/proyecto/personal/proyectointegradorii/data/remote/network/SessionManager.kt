package proyecto.personal.proyectointegradorii.data.remote.network

import android.content.Context

object SessionManager {

    private const val PREF_NAME = "app_session"
    private const val KEY_TOKEN = "token"
    private const val KEY_SESSION_EXPIRES_AT = "session_expires_at"

    private const val SESSION_DURATION_MS = 30 * 60 * 1000L // 30 minutos

    fun saveSession(context: Context, token: String) {
        val expiresAt = System.currentTimeMillis() + SESSION_DURATION_MS
        val prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)

        prefs.edit()
            .putString(KEY_TOKEN, token)
            .putLong(KEY_SESSION_EXPIRES_AT, expiresAt)
            .apply()
    }

    fun getToken(context: Context): String? {
        if (!isSessionValid(context)) {
            clear(context)
            return null
        }

        val prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
        return prefs.getString(KEY_TOKEN, null)
    }

    fun isSessionValid(context: Context): Boolean {
        val prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)

        val token = prefs.getString(KEY_TOKEN, null)
        val expiresAt = prefs.getLong(KEY_SESSION_EXPIRES_AT, 0L)

        if (token.isNullOrBlank()) return false
        if (expiresAt <= 0L) return false

        return System.currentTimeMillis() < expiresAt
    }

    fun getSessionExpiration(context: Context): Long {
        val prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
        return prefs.getLong(KEY_SESSION_EXPIRES_AT, 0L)
    }

    fun clear(context: Context) {
        val prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
        prefs.edit().clear().apply()
    }
}
