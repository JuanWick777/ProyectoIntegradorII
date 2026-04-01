package proyecto.personal.proyectointegradorii.ui.components.cards.header

import android.widget.Space
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Restaurant
import androidx.compose.material3.Icon
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import proyecto.personal.proyectointegradorii.ui.components.buttons.icons.IconNavigateButton
import proyecto.personal.proyectointegradorii.ui.components.texts.Tittle
import proyecto.personal.proyectointegradorii.ui.theme.MainColor

@Composable
fun CardHeaderCBack(
    tittle: String,
    sizetittle: Int,
    modifier: Modifier = Modifier,
    navController: NavController
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
        Row(
            modifier = Modifier.padding(vertical = 35.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center
        ) {
            IconNavigateButton(
                icon = Icons.Default.ArrowBack,
                contentDescription = "Regresar",
                onClick = {
                    navController.popBackStack()
                },
                modifier = Modifier,
                size = 50,
                containerColor = MainColor,
                iconColor = Color.White,
                elevation = 1
            )
            Spacer(Modifier.padding(horizontal = 5.dp))
            Tittle(tittle, sizetittle, Modifier)
        }
    }
}