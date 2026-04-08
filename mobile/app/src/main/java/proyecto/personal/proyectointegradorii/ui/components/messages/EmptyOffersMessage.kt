package proyecto.personal.proyectointegradorii.ui.components.messages

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.LocalOffer
import androidx.compose.material3.Icon
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import proyecto.personal.proyectointegradorii.ui.components.texts.GlobalText
import proyecto.personal.proyectointegradorii.ui.theme.MainColor
import proyecto.personal.proyectointegradorii.ui.theme.TextColorGray

@Composable
fun EmptyOffersMessage(modifier: Modifier = Modifier) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(vertical = 32.dp, horizontal = 20.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Icon(
            imageVector = Icons.Outlined.LocalOffer,
            contentDescription = "Sin más promociones",
            tint = MainColor.copy(alpha = 0.4f),
            modifier = Modifier
                .size(70.dp)
        )

        Spacer(modifier = Modifier.height(16.dp))

        GlobalText(
            texto = "¡Mantente atento a nuevas\npromociones!",
            tamanio = 16,
            color = TextColorGray,
            textAlign = TextAlign.Center
        )
    }
}