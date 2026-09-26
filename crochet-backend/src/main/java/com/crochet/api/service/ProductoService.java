package com.crochet.api.service;

import com.crochet.api.dto.ProductoRequest;
import com.crochet.api.dto.ProductoResponse;
import com.crochet.api.exception.RecursoNoEncontradoException;
import com.crochet.api.model.Producto;
import com.crochet.api.repository.ProductoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;

    public ProductoService(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    public List<ProductoResponse> listarActivos() {
        return productoRepository.findByActivoTrue().stream()
                .map(ProductoResponse::fromEntity)
                .toList();
    }

    public ProductoResponse obtenerPorId(Long id) {
        return ProductoResponse.fromEntity(buscarEntidad(id));
    }

    public ProductoResponse crear(ProductoRequest request) {
        Producto producto = Producto.builder()
                .nombre(request.name())
                .categoria(request.category())
                .categoryLabel(request.categoryLabel())
                .precio(request.price())
                .precioOriginal(request.originalPrice())
                .image(request.image())
                .shortDescription(request.shortDescription())
                .fullDescription(request.fullDescription())
                .materials(request.materials())
                .dimensions(request.dimensions())
                .timeToMake(request.timeToMake())
                .inStock(request.inStock() == null || request.inStock())
                .featured(request.featured() != null && request.featured())
                .colors(request.colors())
                .rating(request.rating())
                .reviewsCount(request.reviewsCount())
                .activo(true)
                .build();
        return ProductoResponse.fromEntity(productoRepository.save(producto));
    }

    public ProductoResponse actualizar(Long id, ProductoRequest request) {
        Producto producto = buscarEntidad(id);
        producto.setNombre(request.name());
        producto.setCategoria(request.category());
        producto.setCategoryLabel(request.categoryLabel());
        producto.setPrecio(request.price());
        producto.setPrecioOriginal(request.originalPrice());
        producto.setImage(request.image());
        producto.setShortDescription(request.shortDescription());
        producto.setFullDescription(request.fullDescription());
        if (request.materials() != null) producto.setMaterials(request.materials());
        producto.setDimensions(request.dimensions());
        producto.setTimeToMake(request.timeToMake());
        if (request.inStock() != null) producto.setInStock(request.inStock());
        if (request.featured() != null) producto.setFeatured(request.featured());
        if (request.colors() != null) producto.setColors(request.colors());
        producto.setRating(request.rating());
        producto.setReviewsCount(request.reviewsCount());
        return ProductoResponse.fromEntity(productoRepository.save(producto));
    }

    /** Borrado logico: se marca inactivo en lugar de eliminar el registro. */
    public void eliminar(Long id) {
        Producto producto = buscarEntidad(id);
        producto.setActivo(false);
        productoRepository.save(producto);
    }

    private Producto buscarEntidad(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Producto no encontrado: " + id));
    }
}
