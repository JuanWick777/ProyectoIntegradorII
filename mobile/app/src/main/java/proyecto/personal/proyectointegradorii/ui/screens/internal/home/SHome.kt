package proyecto.personal.proyectointegradorii.ui.screens.internal.home

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Tune
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import androidx.navigation.NavHostController
import proyecto.personal.proyectointegradorii.data.remote.dto.platillo.PlatilloDto
import proyecto.personal.proyectointegradorii.ui.components.cards.PlatilloCard
import proyecto.personal.proyectointegradorii.ui.components.modals.PlatilloModal
import proyecto.personal.proyectointegradorii.viewmodels.cart.CartViewModel
import proyecto.personal.proyectointegradorii.viewmodels.home.HomeViewModel

@Composable
fun SHome(
    navController: NavController,
    rootNavController: NavHostController,
    cartViewModel: CartViewModel,
    viewModel: HomeViewModel = viewModel()
) {

    val platillos by viewModel.platillos.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()

    var selectedPlatillo by remember { mutableStateOf<PlatilloDto?>(null) }
    var showModal by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier.fillMaxSize()
    ) {

        // TOP BAR
        TopBarFake(
            onProfileClick = {
                navController.navigate("account")
            }
        )

        // LISTA
        if (isLoading) {
            Text("Cargando...", modifier = Modifier.padding(16.dp))
        } else {
            LazyColumn(
                modifier = Modifier.padding(horizontal = 16.dp)
            ) {
                items(platillos) { platillo ->
                    PlatilloCard(
                        nombre = platillo.nombre,
                        descripcion = platillo.descripcion ?: "",
                        precio = platillo.precio,
                        imagenUrl = platillo.urlImagen ?: "",
                        onClickCard = {
                            selectedPlatillo = platillo
                            showModal = true
                        },
                        onClickAdd = {
                            selectedPlatillo = platillo
                            showModal = true
                        }
                    )
                }
            }

            if (showModal && selectedPlatillo != null) {
                PlatilloModal(
                    platillo = selectedPlatillo!!,
                    onDismiss = { showModal = false },
                    onAddToCart = { platillo, cantidad, nota ->
                        cartViewModel.addToCart(platillo, cantidad, nota)
                    }
                )
            }
        }
    }
}

@Composable
fun TopBarFake(
    onProfileClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {

        // Filtros
        IconButton(
            onClick = {},
            modifier = Modifier
                .size(50.dp)
                .background(Color.White, RoundedCornerShape(16.dp))
        ) {
            Icon(Icons.Default.Tune, contentDescription = "")
        }

        Spacer(modifier = Modifier.width(12.dp))

        // Buscador
        Box(
            modifier = Modifier
                .weight(1f)
                .height(50.dp)
                .background(Color.LightGray.copy(alpha = 0.3f), RoundedCornerShape(16.dp)),
            contentAlignment = Alignment.CenterStart
        ) {
            Row(modifier = Modifier.padding(start = 12.dp)) {
                Icon(Icons.Default.Search, contentDescription = "")
                Spacer(modifier = Modifier.width(8.dp))
                Text("Buscar...")
            }
        }

        Spacer(modifier = Modifier.width(12.dp))

        // Perfil
        IconButton(onClick = { onProfileClick() }) {
            Icon(
                imageVector = Icons.Default.Person,
                contentDescription = "Perfil"
            )
        }
    }
}