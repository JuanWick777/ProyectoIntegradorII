package proyecto.personal.proyectointegradorii.ui.components.texts

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.material3.Text
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

@Composable
fun GlobalText(
    texto: String,
    tamanio: Int,
    color: Color,
    modifier: Modifier = Modifier
) {
    Text(
        text = texto,
        fontSize = tamanio.sp,
        color = color,
        modifier = modifier,
        fontWeight = FontWeight.Normal,
        letterSpacing = 1.2.sp
    )
}