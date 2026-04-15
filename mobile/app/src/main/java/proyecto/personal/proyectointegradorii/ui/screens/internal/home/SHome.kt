package proyecto.personal.proyectointegradorii.ui.screens.internal.home

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
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
import androidx.compose.foundation.lazy.LazyRow
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
import androidx.compose.runtime.LaunchedEffect
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
import proyecto.personal.proyectointegradorii.ui.components.bars.HomeTopBar
import proyecto.personal.proyectointegradorii.ui.components.buttons.GlobalButton
import proyecto.personal.proyectointegradorii.ui.components.cards.PlatilloCard
import proyecto.personal.proyectointegradorii.ui.components.modals.PlatilloModal
import proyecto.personal.proyectointegradorii.ui.theme.MainColor
import proyecto.personal.proyectointegradorii.ui.theme.TextColorWhite
import proyecto.personal.proyectointegradorii.viewmodels.cart.CartViewModel
import proyecto.personal.proyectointegradorii.viewmodels.home.HomeViewModel

@Composable
fun SHome(
    navController: NavController,
    cartViewModel: CartViewModel,
    viewModel: HomeViewModel = viewModel()
) {

    val platillos by viewModel.platillosFiltrados.collectAsState()
    val categorias by viewModel.categorias.collectAsState()
    val searchQuery by viewModel.searchQuery.collectAsState()
    val selectedCategory by viewModel.selectedCategory.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    val mesaId by cartViewModel.mesaSeleccionada.collectAsState()
    val menuEnabled = mesaId != null
    val ordenes by cartViewModel.ordenes.collectAsState()

    var showCategories by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        cartViewModel.cargarMisOrdenes()
    }

    var selectedPlatillo by remember { mutableStateOf<PlatilloDto?>(null) }
    var showModal by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier.fillMaxSize()
    ) {

        // TOP BAR
        HomeTopBar(
            searchQuery = searchQuery,
            onSearchChange = viewModel::onSearchQueryChange,
            onToggleCategories = { showCategories = !showCategories },
            onProfileClick = {
                navController.navigate("account")
            },
            mesaActual = mesaId,
            pedidosActivos = ordenes.count {
                it.estado.lowercase() !in listOf("cerrada", "cancelada")
            },
            menuEnabled = menuEnabled
        )

        if (!menuEnabled) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp)
                    .background(
                        color = MainColor,
                        shape = RoundedCornerShape(28.dp)
                    )
                    .padding(horizontal = 24.dp, vertical = 28.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = "⌁⌁",
                        color = Color.White.copy(alpha = 0.9f)
                    )

                    Spacer(modifier = Modifier.height(20.dp))

                    Text(
                        text = "¡Bienvenido!",
                        color = Color.White
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    Text(
                        text = "Para ver nuestro menú completo y realizar tu pedido, por favor escanea el código QR de tu mesa.",
                        color = Color.White,
                        modifier = Modifier.padding(horizontal = 8.dp)
                    )

                    Spacer(modifier = Modifier.height(24.dp))

                    GlobalButton(
                        "Escanear QR",
                        16,
                        50,
                        220,
                        Color.White,
                        Color.White,
                        MainColor,
                        {
                            navController.navigate("scan")
                        },
                        Modifier
                    )
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            Text(
                text = "Vista Previa del Menú",
                modifier = Modifier.padding(horizontal = 16.dp),
                color = Color(0xFF2A160E)
            )
        }

        if (showCategories && menuEnabled) {
            LazyRow(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                item {
                    GlobalButton(
                        "Todas",
                        14,
                        42,
                        140,
                        if (selectedCategory == null) MainColor else Color.LightGray,
                        if (selectedCategory == null) MainColor else Color.LightGray,
                        TextColorWhite,
                        {
                            viewModel.onCategorySelected(null)
                        },
                        Modifier
                    )
                }

                items(categorias) { categoria ->
                    GlobalButton(
                        categoria,
                        14,
                        42,
                        160,
                        if (selectedCategory == categoria) MainColor else Color.LightGray,
                        if (selectedCategory == categoria) MainColor else Color.LightGray,
                        TextColorWhite,
                        {
                            viewModel.onCategorySelected(categoria)
                        },
                        Modifier
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))
        }


        // LISTA
        if (isLoading) {
            Text("Cargando...", modifier = Modifier.padding(16.dp))
        } else {
            val platillosMostrar = if (menuEnabled) platillos else platillos.take(3)
            LazyColumn(
                modifier = Modifier.padding(horizontal = 16.dp)
            ) {
                items(platillosMostrar) { platillo ->
                    val disponible = platillo.estaDisponible()
                PlatilloCard(
                        nombre = platillo.nombre,
                        descripcion = platillo.descripcion ?: "",
                        precio = platillo.precio,
                        imagenUrl = platillo.urlImagen ?: "",
                        onClickCard = {
                            if (menuEnabled && disponible) {
                                selectedPlatillo = platillo
                                showModal = true
                            }
                        },
                        onClickAdd = {
                            if (menuEnabled && disponible) {
                                selectedPlatillo = platillo
                                showModal = true
                            }
                        },
                        enabled = menuEnabled && disponible
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
