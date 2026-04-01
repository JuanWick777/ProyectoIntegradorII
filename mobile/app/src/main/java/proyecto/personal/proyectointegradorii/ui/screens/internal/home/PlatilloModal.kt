package proyecto.personal.proyectointegradorii.ui.components.modals

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import proyecto.personal.proyectointegradorii.data.remote.dto.platillo.PlatilloDto

@Composable
fun PlatilloModal(
    platillo: PlatilloDto,
    onDismiss: () -> Unit,
    onAddToCart: (PlatilloDto, Int, String) -> Unit
) {

    var cantidad by remember { mutableStateOf(1) }
    var nota by remember { mutableStateOf("") }

    AlertDialog(
        onDismissRequest = onDismiss,
        confirmButton = {
            Button(onClick = {
                onAddToCart(platillo, cantidad, nota)
                onDismiss()
            }) {
                Text("Agregar al carrito")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancelar")
            }
        },
        title = {
            Text(platillo.nombre)
        },
        text = {
            Column {

                Text(platillo.descripcion ?: "")
                Spacer(modifier = Modifier.height(10.dp))

                Text("Precio: $${platillo.precio}")

                Spacer(modifier = Modifier.height(10.dp))

                // Cantidad
                Row {
                    Button(onClick = { if (cantidad > 1) cantidad-- }) {
                        Text("-")
                    }

                    Spacer(modifier = Modifier.width(10.dp))

                    Text(cantidad.toString())

                    Spacer(modifier = Modifier.width(10.dp))

                    Button(onClick = { cantidad++ }) {
                        Text("+")
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Nota del cliente
                OutlinedTextField(
                    value = nota,
                    onValueChange = { nota = it },
                    label = { Text("Nota del cliente") },
                    modifier = Modifier.fillMaxWidth()
                )
            }
        }
    )
}