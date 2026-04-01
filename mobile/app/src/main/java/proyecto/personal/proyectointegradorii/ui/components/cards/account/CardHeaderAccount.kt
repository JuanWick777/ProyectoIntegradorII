package proyecto.personal.proyectointegradorii.ui.components.cards.account

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.Icon
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import proyecto.personal.proyectointegradorii.ui.components.texts.GlobalText
import proyecto.personal.proyectointegradorii.ui.components.texts.Tittle
import proyecto.personal.proyectointegradorii.ui.theme.CommentTextColor
import proyecto.personal.proyectointegradorii.ui.theme.MainColor
import proyecto.personal.proyectointegradorii.ui.theme.TextColorWhite

@Composable
fun CardHeaderAccount(
    nameUser: String,
    emailUser: String,
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
                .padding(vertical = 35.dp)
                .padding(top = 15.dp)
        ) {
            Tittle("Mi Perfil", 50, Modifier)
            Spacer(Modifier.padding(vertical = 10.dp))
            Box(
                modifier = Modifier
                    .size(100.dp)
                    .clip(CircleShape)
                    .background(MainColor)
                    .border(
                        width = 2.dp,
                        color = MainColor,
                        shape = CircleShape
                    )
                    .padding(vertical = 15.dp),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.Person,
                    contentDescription = "Icono de Perfil",
                    tint = Color.White,
                    modifier = Modifier.size(70.dp),
                )
            }
            Spacer(Modifier.padding(vertical = 8.dp))
            GlobalText(
                nameUser,
                25,
                TextColorWhite,
                Modifier
            )
            Spacer(Modifier.padding(vertical = 5.dp))
            GlobalText(
                emailUser,
                18,
                CommentTextColor,
                Modifier
            )
            Spacer(Modifier.padding(vertical = 15.dp))
        }
    }
}