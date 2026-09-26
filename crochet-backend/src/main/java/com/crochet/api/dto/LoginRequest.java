package com.crochet.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * Coincide con "LoginCredentials" del frontend: { email, password, rememberMe? }.
 * "rememberMe" es solo de uso en el cliente; el backend lo ignora.
 */
public record LoginRequest(
        @NotBlank @Email String email,
        @NotBlank String password
) {}
