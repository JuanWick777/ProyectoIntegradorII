package proyecto.personal.proyectointegradorii.ui.components.images

import androidx.annotation.DrawableRes
import androidx.compose.foundation.Image
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp

@Composable
fun Logo(
    @DrawableRes logo: Int,
    tamanio: Int,
    modifier: Modifier = Modifier,
    onClick: (()-> Unit)? = null
){
    Card(
        modifier = modifier
            .size(tamanio.dp)
            .then(if (
                onClick != null
                ) Modifier.clickable {onClick()}
            else Modifier
            ),
        shape = RoundedCornerShape(125.dp),
        elevation = CardDefaults.cardElevation(12.dp)
    ){
        Image(
            painter = painterResource(id = logo),
            contentDescription = "Logo",
            contentScale = ContentScale.Crop,
            modifier = Modifier.fillMaxSize()
        )
    }
}