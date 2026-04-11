package proyecto.personal.proyectointegradorii.ui.navigation.internalroutes

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.LocalOffer
import androidx.compose.material.icons.filled.QrCode
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material.icons.filled.StarBorder
import androidx.compose.ui.graphics.vector.ImageVector

sealed class BottomNavItems(
    val route: String,
    val icon: ImageVector,
    val label: String
) {
    object Home: BottomNavItems("home", Icons.Default.Home, "Inicio")
    object Cart: BottomNavItems("cart", Icons.Default.ShoppingCart, "Carrito")
    object Scan: BottomNavItems("scan", Icons.Default.QrCode, "Escanear")
    object Offers: BottomNavItems("offers", Icons.Default.LocalOffer, "Ofertas")
    object Points: BottomNavItems("points", Icons.Default.StarBorder, "Puntos")
}