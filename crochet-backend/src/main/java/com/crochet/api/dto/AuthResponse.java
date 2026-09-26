package com.crochet.api.dto;

public record AuthResponse(
        String token,
        String tipo,      // "Bearer"
        long expiraEnMs,  // tiempo de vida del token, en milisegundos
        UsuarioResponse usuario
) {}
