package proyecto.personal.proyectointegradorii.ui.screens.internal.scan

import android.net.Uri
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.google.android.gms.common.api.CommonStatusCodes
import com.google.mlkit.vision.barcode.common.Barcode
import com.google.mlkit.vision.codescanner.GmsBarcodeScannerOptions
import com.google.mlkit.vision.codescanner.GmsBarcodeScanning
import proyecto.personal.proyectointegradorii.ui.components.buttons.GlobalButton
import proyecto.personal.proyectointegradorii.ui.components.cards.GlobalCard
import proyecto.personal.proyectointegradorii.ui.components.headers.InternalHeader
import proyecto.personal.proyectointegradorii.ui.components.texts.GlobalText
import proyecto.personal.proyectointegradorii.ui.theme.BackgroundCardColor
import proyecto.personal.proyectointegradorii.ui.theme.BackgroundColor
import proyecto.personal.proyectointegradorii.ui.theme.MainColor
import proyecto.personal.proyectointegradorii.ui.theme.TextColorDark
import proyecto.personal.proyectointegradorii.ui.theme.TextColorWhite
import proyecto.personal.proyectointegradorii.viewmodels.cart.CartViewModel

@Composable
fun SScan(
    cartViewModel: CartViewModel,
    navController: NavController
) {
    val context = LocalContext.current
    var errorMessage by remember { mutableStateOf<String?>(null) }

    val options = GmsBarcodeScannerOptions.Builder()
        .setBarcodeFormats(Barcode.FORMAT_QR_CODE)
        .build()

    val scanner = remember {
        GmsBarcodeScanning.getClient(context, options)
    }

    fun extraerMesa(rawValue: String?): Long? {
        if (rawValue.isNullOrBlank()) return null

        rawValue.toLongOrNull()?.let { return it }

        return try {
            val uri = Uri.parse(rawValue)
            uri.getQueryParameter("mesa")?.toLongOrNull()
        } catch (e: Exception) {
            null
        }
    }

    fun confirmarMesa(mesaId: Long?) {
        if (mesaId != null && mesaId > 0) {
            errorMessage = null
            cartViewModel.setMesaSeleccionada(mesaId)
            navController.navigate("home") {
                popUpTo("home") {
                    inclusive = false
                }
                launchSingleTop = true
            }
        } else {
            errorMessage = "El QR no contiene una mesa valida"
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundColor)
            .padding(horizontal = 20.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        InternalHeader(
            "Escanear QR",
            28,
            Modifier
        )

        Spacer(modifier = Modifier.height(40.dp))

        GlobalCard(
            {
                GlobalText(
                    "Escanea el código QR de tu mesa para asignarla automaticamente.",
                    15,
                    TextColorDark,
                    Modifier
                        .align(Alignment.CenterHorizontally)
                        .padding(horizontal = 10.dp, vertical = 18.dp)
                        .fillMaxWidth()
                )
            },
            Modifier,
            BackgroundCardColor
        )

        Spacer(modifier = Modifier.height(20.dp))

        errorMessage?.let {
            Text(it)
            Spacer(modifier = Modifier.height(12.dp))
        }

        GlobalButton(
            "Escanear codigo QR",
            16,
            50,
            280,
            MainColor,
            MainColor,
            TextColorWhite,
            {
                errorMessage = null

                scanner.startScan()
                    .addOnSuccessListener { barcode ->
                        confirmarMesa(extraerMesa(barcode.rawValue))
                    }
                    .addOnCanceledListener {
                        errorMessage = "Escaneo cancelado"
                    }
                    .addOnFailureListener { e ->
                        errorMessage = if ((e.message ?: "").contains(CommonStatusCodes.CANCELED.toString())) {
                            "Escaneo cancelado"
                        } else {
                            "No se pudo leer el codigo QR"
                        }
                    }
            },
            Modifier
        )
    }
}
