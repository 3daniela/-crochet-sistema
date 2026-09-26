package com.crochet.api.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * Encapsula la generación y validación de JSON Web Tokens.
 *
 * - Algoritmo: HMAC-SHA256 (HS256), firmado con una clave secreta simétrica
 *   (jwt.secret) que SOLO conoce el backend.
 * - El token lleva: subject = email del usuario, claim "rol", fecha de
 *   emisión (iat) y fecha de expiración (exp).
 * - jwt.expiration-ms controla cuánto vive el token (ver application.yml).
 *   Se maneja como configuración externa para poder ajustarlo sin recompilar
 *   (por ejemplo: 1h en producción, unos minutos en pruebas de expiración).
 */
@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration-ms}")
    private long expirationMs;

    public String generateToken(UserDetails userDetails, String rol) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("rol", rol);
        return buildToken(claims, userDetails.getUsername(), expirationMs);
    }

    private String buildToken(Map<String, Object> claims, String subject, long expirationMs) {
        Date ahora = new Date();
        Date expiracion = new Date(ahora.getTime() + expirationMs);

        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(ahora)
                .expiration(expiracion)
                .signWith(getSigningKey())
                .compact();
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractRol(String token) {
        return extractAllClaims(token).get("rol", String.class);
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public long getExpirationMs() {
        return expirationMs;
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getSigningKey() {
        // La clave debe tener al menos 256 bits (32 bytes) para HS256.
        return Keys.hmacShaKeyFor(secret.getBytes());
    }
}
