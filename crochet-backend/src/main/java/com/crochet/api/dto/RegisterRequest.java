package com.crochet.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Mismos nombres de campo que la interfaz TypeScript "RegisterData" del
 * frontend: { name, email, phone?, city?, password, acceptTerms }.
 * "acceptTerms" no se persiste, solo se recibe (Jackson ignora props
 * desconocidas si llegaran de mas, ver application.yml).
 */
public record RegisterRequest(
        @NotBlank @Size(min = 2, max = 100) String name,
        @NotBlank @Email String email,
        String phone,
        String city,
        @NotBlank @Size(min = 8, max = 72) String password
) {}
