package proyecto.personal.proyectointegradorii.ui.components.buttons

import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun GlobalButton(
    text: String,
    textsize: Int,
    alt: Int,
    ancho: Int,
    bordercolorbutton: Color,
    colorbutton: Color,
    colortext: Color,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true
){
    Button(
        onClick = onClick,
        enabled = enabled,
        modifier = modifier
            .height(alt.dp)
            .width(ancho.dp),
        colors = ButtonDefaults.buttonColors(
            containerColor = bordercolorbutton,
            disabledContentColor = colorbutton.copy(alpha = 0.4f),
            contentColor = colorbutton
        ),
        shape = RoundedCornerShape(15.dp),
        elevation = ButtonDefaults.buttonElevation(
            defaultElevation = 10.dp,
            pressedElevation = 5.dp,
            disabledElevation = 0.dp
        ),
        contentPadding = PaddingValues(
            horizontal = 18.dp,
            vertical = 12.dp
        )
        ){
        Text(
            text = text,
            fontWeight = FontWeight.SemiBold,
            fontStyle = FontStyle.Italic,
            fontSize = textsize.sp,
            color = colortext
        )
    }
}