package proyecto.personal.proyectointegradorii.utils

import proyecto.personal.proyectointegradorii.BuildConfig

object ImageUrlResolver {
    fun resolve(pathOrUrl: String?): String? {
        if (pathOrUrl.isNullOrBlank()) return null
        if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
            return pathOrUrl
        }

        val base = BuildConfig.BASE_URL.removeSuffix("/")
        val path = if (pathOrUrl.startsWith("/")) pathOrUrl else "/$pathOrUrl"
        return "$base$path"
    }
}