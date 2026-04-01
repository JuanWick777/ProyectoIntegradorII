package proyecto.personal.proyectointegradorii.ui.components.cards.header

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Restaurant
import androidx.compose.material3.Icon
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import proyecto.personal.proyectointegradorii.ui.components.texts.Tittle
import proyecto.personal.proyectointegradorii.ui.theme.MainColor

@Composable
fun CardHeaderCLogo(
    tittle: String,
    modifier: Modifier = Modifier
) {
    Surface(
        shape = RoundedCornerShape(
            bottomStart = 50.dp,
            bottomEnd = 50.dp
        ),
        color = MainColor,
        tonalElevation = 6.dp,
        shadowElevation = 6.dp,
        modifier = modifier
            .fillMaxWidth()
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier
                .padding(vertical = 15.dp)
        ) {
            Box(
               modifier = Modifier
                   .size(100.dp)
                   .clip(CircleShape)
                   .background(Color.White)
                   .padding(vertical = 15.dp),
               contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.Restaurant,
                    contentDescription = "Imagen de un tenedor y cuchillo",
                    tint = MainColor,
                    modifier = Modifier.size(80.dp)
                )
            }
            Spacer(modifier = Modifier.height(18.dp))
            Tittle(tittle, 50, Modifier)
        }
    }
}