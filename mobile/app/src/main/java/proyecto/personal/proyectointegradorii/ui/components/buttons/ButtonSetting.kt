package proyecto.personal.proyectointegradorii.ui.components.buttons

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import proyecto.personal.proyectointegradorii.ui.components.texts.GlobalText
import proyecto.personal.proyectointegradorii.ui.theme.MainColor
import proyecto.personal.proyectointegradorii.ui.theme.TextColorDark
import proyecto.personal.proyectointegradorii.ui.theme.TextColorGray

@Composable
fun ButtonSetting(
    icon: ImageVector,
    title: String,
    subtitle: String,
    iconTintColor: Color = MainColor,
    trailingContent: @Composable () -> Unit = {} // Por defecto vacío, por si no lleva Switch
) {
    val containerColor = iconTintColor.copy(alpha = 0.15f)

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 12.dp, horizontal = 18.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        // Caja del ícono (Misma lógica de tu ButtonAccount)
        Box(
            modifier = Modifier
                .size(40.dp)
                .clip(RoundedCornerShape(10.dp))
                .background(containerColor),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = icon,
                contentDescription = title,
                tint = iconTintColor
            )
        }
        Spacer(Modifier.width(15.dp))
        // Textos centralizados
        Column(modifier = Modifier.weight(1f)) {
            GlobalText(
                texto = title,
                tamanio = 16,
                color = TextColorDark,
                peso = FontWeight.SemiBold
            )
            Spacer(modifier = Modifier.height(2.dp))
            GlobalText(
                texto = subtitle,
                tamanio = 14,
                color = TextColorGray
            )
        }
        Spacer(Modifier.width(10.dp))
        // Elemento final (Switch, Flecha, etc.)
        trailingContent()
    }
}