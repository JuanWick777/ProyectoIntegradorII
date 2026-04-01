package proyecto.personal.proyectointegradorii.ui.components.images

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Icon
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp

@Composable
fun CircularIcon(
    icon: ImageVector,
    tintIcon: Color,
    backgroundColor: Color,
    description: String

) {
    Box(
        modifier = Modifier
            .size(100.dp)
            .clip(CircleShape)
            .background(backgroundColor)
            .padding(vertical = 15.dp),
        contentAlignment = Alignment.Center
    ) {
        Icon(
            icon,
            contentDescription = description,
            tint = tintIcon,
            modifier = Modifier.size(80.dp)
        )
    }
}