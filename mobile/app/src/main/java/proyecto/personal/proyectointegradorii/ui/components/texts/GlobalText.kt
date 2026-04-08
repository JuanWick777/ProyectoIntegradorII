package proyecto.personal.proyectointegradorii.ui.components.texts

import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.material3.Text
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.sp

@Composable
fun GlobalText(
    texto: String,
    tamanio: Int,
    color: Color,
    modifier: Modifier = Modifier,
    textAlign: TextAlign? = null,
    peso: FontWeight = FontWeight.Normal
) {
    Text(
        text = texto,
        fontSize = tamanio.sp,
        color = color,
        modifier = modifier,
        fontWeight = peso,
        letterSpacing = 1.2.sp,
        textAlign = textAlign
    )
}