package proyecto.personal.proyectointegradorii.ui.components.buttons.icons

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

@Composable
fun DishControlIcon(
    icon: ImageVector,
    tint: Color,
    contentDescription: String,
    modifier: Modifier = Modifier, // Este modifier es para posicionamiento en el padre
    size: Dp = 32.dp, // Tamaño más pequeño por defecto para una card, permite pasar tamaños distintos
    onClick: () -> Unit
) {
    val containerColor = tint.copy(alpha = 0.15f) // Fondo sutilmente tintado basado en el color del icono
    val iconSize = (size.value * 0.55f).dp // Tamaño del icono sutilmente menor dentro del contenedor

    Box(
        modifier = modifier // Recibe el modifier del padre para su posicionamiento externo
            .size(size)
            .clip(RoundedCornerShape(8.dp)) // Usamos un redondeado sutil
            .background(containerColor)
            .clickable { onClick() },
        contentAlignment = Alignment.Center
    ) {
        Icon(
            imageVector = icon,
            contentDescription = contentDescription,
            tint = tint,
            modifier = Modifier.size(iconSize) // Tamaño interno del icono
        )
    }
}