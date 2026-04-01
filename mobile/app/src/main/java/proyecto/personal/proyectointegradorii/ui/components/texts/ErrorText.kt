package proyecto.personal.proyectointegradorii.ui.components.texts

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import proyecto.personal.proyectointegradorii.ui.theme.AlertColor

@Composable
fun ErrorText(
    error: String?,
    size: Int,
    modifier: Modifier = Modifier
    ) {
    if (error != null) {
        Text(
            text = error,
            fontSize = size.sp,
            color = AlertColor,
            modifier = modifier
                .fillMaxWidth()
                .padding(start = 3.dp, top = 3.dp),
            fontWeight = FontWeight.Normal,
            letterSpacing = 1.1.sp
        )
    }
}