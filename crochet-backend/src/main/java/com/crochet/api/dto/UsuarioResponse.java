package com.crochet.api.dto;

import com.crochet.api.model.Usuario;

import java.time.format.DateTimeFormatter;

/**
 * Coincide con la interfaz TypeScript "User" del frontend:
 * { id?: string; name: string; email: string; phone?: string; city?: string; createdAt?: string; }
 * Se agrega "rol" extra (el frontend lo ignora si no lo usa, no rompe nada).
 */
public record UsuarioResponse(
        String id,
        String name,
        String email,
        String phone,
        String city,
        String createdAt,
        String rol
) {
    private static final DateTimeFormatter FORMATO = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    public static UsuarioResponse fromEntity(Usuario u) {
        String fecha = u.getFechaCreacion() != null ? u.getFechaCreacion().format(FORMATO) : null;
        return new UsuarioResponse(
                String.valueOf(u.getId()),
                u.getNombre(),
                u.getEmail(),
                u.getPhone(),
                u.getCity(),
                fecha,
                u.getRol().name()
        );
    }
}
