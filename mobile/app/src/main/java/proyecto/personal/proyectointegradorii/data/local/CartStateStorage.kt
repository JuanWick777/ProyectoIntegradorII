package proyecto.personal.proyectointegradorii.data.local

import android.content.Context
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import proyecto.personal.proyectointegradorii.data.model.cart.CartItem
import proyecto.personal.proyectointegradorii.data.remote.dto.orden.OrdenResponseDTO

object CartStateStorage {

    private const val PREF_NAME = "cart_state"
    private const val KEY_CART_ITEMS = "cart_items"
    private const val KEY_ORDEN_ACTUAL = "orden_actual"
    private const val KEY_ORDENES = "ordenes"
    private const val KEY_MESA_SELECCIONADA = "mesa_seleccionada"

    private val gson = Gson()

    fun saveCartItems(context: Context, items: List<CartItem>) {
        val prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
        prefs.edit()
            .putString(KEY_CART_ITEMS, gson.toJson(items))
            .apply()
    }

    fun getCartItems(context: Context): List<CartItem> {
        val prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
        val json = prefs.getString(KEY_CART_ITEMS, null) ?: return emptyList()

        val type = object : TypeToken<List<CartItem>>() {}.type
        return gson.fromJson(json, type) ?: emptyList()
    }

    fun saveOrdenActual(context: Context, orden: OrdenResponseDTO?) {
        val prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
        prefs.edit()
            .putString(KEY_ORDEN_ACTUAL, gson.toJson(orden))
            .apply()
    }

    fun getOrdenActual(context: Context): OrdenResponseDTO? {
        val prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
        val json = prefs.getString(KEY_ORDEN_ACTUAL, null) ?: return null
        return gson.fromJson(json, OrdenResponseDTO::class.java)
    }

    fun saveOrdenes(context: Context, ordenes: List<OrdenResponseDTO>) {
        val prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
        prefs.edit()
            .putString(KEY_ORDENES, gson.toJson(ordenes))
            .apply()
    }

    fun getOrdenes(context: Context): List<OrdenResponseDTO> {
        val prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
        val json = prefs.getString(KEY_ORDENES, null) ?: return emptyList()

        val type = object : TypeToken<List<OrdenResponseDTO>>() {}.type
        return gson.fromJson(json, type) ?: emptyList()
    }

    fun saveMesaSeleccionada(context: Context, mesaId: Long?) {
        val prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
        prefs.edit()
            .putLong(KEY_MESA_SELECCIONADA, mesaId ?: -1L)
            .apply()
    }

    fun getMesaSeleccionada(context: Context): Long? {
        val prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
        val value = prefs.getLong(KEY_MESA_SELECCIONADA, -1L)
        return if (value == -1L) null else value
    }

    fun clear(context: Context) {
        val prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
        prefs.edit().clear().apply()
    }
}