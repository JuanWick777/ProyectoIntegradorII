package proyecto.personal.proyectointegradorii.ui.components.buttons

import android.os.SystemClock
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableLongStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.TextUnit

@Composable
fun GlobalTextButton(
    text: String,
    color: Color,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    underline: Boolean = true,
    fontSize: TextUnit,
    debounceMillis: Long = 900L
){
    var lastClickAt by remember { mutableLongStateOf(0L) }

    TextButton(
        onClick = {
            val now = SystemClock.elapsedRealtime()
            if (now - lastClickAt >= debounceMillis) {
                lastClickAt = now
                onClick()
            }
        },
        modifier = modifier,
        colors = ButtonDefaults.textButtonColors(
            contentColor = color
        )
    )
    {
        val interactionSource = remember { MutableInteractionSource() }
        val isPressed by interactionSource.collectIsPressedAsState()

        Text(
            text = text,
            fontSize = fontSize,
            fontWeight = FontWeight.Medium,
            textDecoration = if (underline) TextDecoration.Underline else TextDecoration.None,
            color = if (isPressed) color.copy(alpha = 0.6f) else color
        )
    }
}
