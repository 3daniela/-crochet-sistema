package com.crochet.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

/**
 * DTO para crear/editar productos (uso administrativo, vía Postman o un
 * futuro panel admin). Mismos nombres en inglés que ProductoResponse.
 */
public record ProductoRequest(
        @NotBlank String name,
        @NotBlank String category,
        String categoryLabel,
        @NotNull BigDecimal price,
        BigDecimal originalPrice,
        String image,
        String shortDescription,
        String fullDescription,
        List<String> materials,
        String dimensions,
        String timeToMake,
        Boolean inStock,
        Boolean featured,
        List<String> colors,
        Double rating,
        Integer reviewsCount
) {}
