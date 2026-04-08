package proyecto.personal.proyectointegradorii.ui.components.headers

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import proyecto.personal.proyectointegradorii.ui.components.buttons.icons.IconNavigateButton
import proyecto.personal.proyectointegradorii.ui.components.texts.Tittle
import proyecto.personal.proyectointegradorii.ui.theme.MainColor

@Composable
fun HeaderCBack(
    tittle: String,
    sizetittle: Int,
    backgroundColor: Color,
    modifier: Modifier = Modifier,
    navController: NavController
) {
    Surface(
        shape = RoundedCornerShape(
            bottomStart = 50.dp,
            bottomEnd = 50.dp
        ),
        // Si hay gradiente, el color de la Surface debe ser transparente para que se vea
        color = backgroundColor,
        tonalElevation = 6.dp,
        shadowElevation = 6.dp,
        modifier = modifier
            .fillMaxWidth()
    ) {
        Row(
            modifier = Modifier.padding(vertical = 35.dp, horizontal = 20.dp),
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
                containerColor = backgroundColor,
                iconColor = Color.White,
                elevation = 1
            )
            Spacer(Modifier.padding(horizontal = 15.dp))
            Tittle(tittle, sizetittle, Modifier)
        }
    }
}