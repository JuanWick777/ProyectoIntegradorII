package proyecto.personal.proyectointegradorii.ui.components.texts

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shadow
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.sp

@Composable
fun Tittle(titulo: String, size: Int,modifier: Modifier = Modifier){
    Text(
        text = titulo,
        textAlign = TextAlign.Center,
        modifier = modifier.fillMaxWidth(),
        fontSize = size.sp,
        fontWeight = FontWeight.Bold,
        fontStyle =  FontStyle.Italic,
        letterSpacing = 1.35.sp,
        style = TextStyle(
            shadow = Shadow(
                color = Color.Gray,
                offset = Offset(-3f, 5f),
                blurRadius = 4f
            )
        ),
        color = Color.White
    )
}