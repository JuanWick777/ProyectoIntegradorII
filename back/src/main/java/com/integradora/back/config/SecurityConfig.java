package com.integradora.back.config;

import com.integradora.back.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;
import com.integradora.back.security.JsonAccessDeniedHandler;
import com.integradora.back.security.JsonAuthenticationEntryPoint;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JsonAuthenticationEntryPoint authenticationEntryPoint;
    private final JsonAccessDeniedHandler accessDeniedHandler;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(authenticationEntryPoint)
                        .accessDeniedHandler(accessDeniedHandler)
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/login", "/api/auth/register").permitAll()
                        .requestMatchers(HttpMethod.GET, "/uploads/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/mesas/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/platillos/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/cocina").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/promociones").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/ordenes/completa").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/ordenes/{id}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/ordenes/mis-ordenes").hasRole("CLIENTE")
                        .requestMatchers(HttpMethod.GET, "/api/auth/me").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/auth/perfil").hasRole("CLIENTE")
                        .requestMatchers(HttpMethod.POST, "/api/auth/foto-perfil").hasRole("CLIENTE")
                        .requestMatchers(HttpMethod.DELETE, "/api/auth/eliminar-cuenta").hasRole("CLIENTE")
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/cocina/**").hasAnyRole("COCINERO", "CHEF", "PARRILLERO", "BARISTA", "REPOSTERO", "ADMIN")
                        .requestMatchers("/api/detalle-orden/**").hasAnyRole("COCINERO", "CHEF", "PARRILLERO", "BARISTA", "REPOSTERO", "ADMIN")
                        .requestMatchers("/api/mesero/**").hasAnyRole("MESERO", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/ordenes/**").hasAnyRole("MESERO", "COCINERO", "CHEF", "PARRILLERO", "BARISTA", "REPOSTERO", "ADMIN")
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        // allowedOriginPatterns permite usar allowCredentials con comodines
        config.addAllowedOriginPattern("http://localhost:*");
        config.addAllowedOriginPattern("http://192.168.*.*:*");
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
