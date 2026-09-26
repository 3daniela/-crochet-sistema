package com.crochet.api.dto;

import com.crochet.api.model.Producto;

import java.math.BigDecimal;
import java.util.List;

/**
 * Los nombres de los campos son EXACTAMENTE los de la interfaz TypeScript
 * "Product" del frontend (nombres en ingles), para que Angular pueda
 * consumir la respuesta del backend sin ningun mapeo adicional.
 */
public record ProductoResponse(
        String id,
        String name,
        String category,
        String categoryLabel,
        BigDecimal price,
        BigDecimal originalPrice,
        String image,
        String shortDescription,
        String fullDescription,
        List<String> materials,
        String dimensions,
        String timeToMake,
        boolean inStock,
        boolean featured,
        List<String> colors,
        Double rating,
        Integer reviewsCount
) {
    public static ProductoResponse fromEntity(Producto p) {
        return new ProductoResponse(
                String.valueOf(p.getId()),
                p.getNombre(),
                p.getCategoria(),
                p.getCategoryLabel(),
                p.getPrecio(),
                p.getPrecioOriginal(),
                p.getImage(),
                p.getShortDescription(),
                p.getFullDescription(),
                p.getMaterials(),
                p.getDimensions(),
                p.getTimeToMake(),
                p.isInStock(),
                p.isFeatured(),
                p.getColors(),
                p.getRating(),
                p.getReviewsCount()
        );
    }
}
