package proyecto.personal.proyectointegradorii.data.remote.network

import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import java.util.concurrent.TimeUnit
import proyecto.personal.proyectointegradorii.App
import proyecto.personal.proyectointegradorii.data.local.AppStateCleaner
import proyecto.personal.proyectointegradorii.data.remote.api.ApiService
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object RetrofitClient {

    private const val BASE_URL = "http://10.0.2.2:8080/"
    //private const val BASE_URL = "http://192.168.109.242:8080/"

    private val logging = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY
    }

    val authInterceptor = Interceptor { chain ->
        val requestBuilder = chain.request().newBuilder()

        val token = SessionManager.getToken(App.instance)

        if (token != null) {
            requestBuilder.addHeader("Authorization", "Bearer $token")
        }

        val response = chain.proceed(requestBuilder.build())

        val requestPath = chain.request().url.encodedPath
        val isAuthScreenRequest = requestPath.contains("/api/auth/login") ||
                requestPath.contains("/api/auth/register")

        if ((response.code == 401 || response.code == 403) && !isAuthScreenRequest) {
            AppStateCleaner.clearAll(App.instance)
            SessionEvents.notifySessionExpired()
        }

        response
    }

    private val client = OkHttpClient.Builder()
        .connectTimeout(60, TimeUnit.SECONDS)
        .readTimeout(60, TimeUnit.SECONDS)
        .writeTimeout(60, TimeUnit.SECONDS)
        .callTimeout(60, TimeUnit.SECONDS)
        .addInterceptor(logging)
        .addInterceptor(authInterceptor)
        .build()

    val api: ApiService = Retrofit.Builder()
        .baseUrl(BASE_URL)
        .client(client)
        .addConverterFactory(GsonConverterFactory.create())
        .build()
        .create(ApiService::class.java)
}