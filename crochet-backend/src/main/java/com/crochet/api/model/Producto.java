package com.crochet.api.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entidad Producto. Los nombres de los campos y el DTO de salida
 * (ProductoResponse) se disenaron para calzar 1 a 1 con la interfaz
 * TypeScript "Product" del frontend Angular adjuntado por el cliente:
 *
 * export interface Product {
 *   id: string; name: string; category: '...'; categoryLabel: string;
 *   price: number; originalPrice?: number; image: string;
 *   shortDescription: string; fullDescription: string;
 *   materials: string[]; dimensions: string; timeToMake: string;
 *   inStock: boolean; featured: boolean; colors: string[];
 *   rating: number; reviewsCount: number;
 * }
 *
 * Sin Lombok a proposito (compatibilidad total con Eclipse/STS sin plugins).
 */
@Entity
@Table(name = "productos")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String nombre;

    /** Valores esperados: amigurumis, bolsos, prendas, hogar, macrame */
    @Column(nullable = false, length = 50)
    private String categoria;

    @Column(name = "category_label", length = 150)
    private String categoryLabel;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;

    @Column(name = "precio_original", precision = 10, scale = 2)
    private BigDecimal precioOriginal;

    @Column(length = 500)
    private String image;

    @Column(name = "short_description", length = 500)
    private String shortDescription;

    @Lob
    @Column(name = "full_description", columnDefinition = "TEXT")
    private String fullDescription;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "producto_materiales", joinColumns = @JoinColumn(name = "producto_id"))
    @Column(name = "material", length = 200)
    private List<String> materials = new ArrayList<>();

    @Column(length = 200)
    private String dimensions;

    @Column(name = "time_to_make", length = 100)
    private String timeToMake;

    @Column(name = "in_stock", nullable = false)
    private boolean inStock = true;

    @Column(nullable = false)
    private boolean featured = false;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "producto_colores", joinColumns = @JoinColumn(name = "producto_id"))
    @Column(name = "color", length = 200)
    private List<String> colors = new ArrayList<>();

    @Column
    private Double rating;

    @Column(name = "reviews_count")
    private Integer reviewsCount;

    @Column(nullable = false)
    private boolean activo = true;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    public Producto() {
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final Producto p = new Producto();

        public Builder nombre(String v) { p.nombre = v; return this; }
        public Builder categoria(String v) { p.categoria = v; return this; }
        public Builder categoryLabel(String v) { p.categoryLabel = v; return this; }
        public Builder precio(BigDecimal v) { p.precio = v; return this; }
        public Builder precioOriginal(BigDecimal v) { p.precioOriginal = v; return this; }
        public Builder image(String v) { p.image = v; return this; }
        public Builder shortDescription(String v) { p.shortDescription = v; return this; }
        public Builder fullDescription(String v) { p.fullDescription = v; return this; }
        public Builder materials(List<String> v) { p.materials = v; return this; }
        public Builder dimensions(String v) { p.dimensions = v; return this; }
        public Builder timeToMake(String v) { p.timeToMake = v; return this; }
        public Builder inStock(boolean v) { p.inStock = v; return this; }
        public Builder featured(boolean v) { p.featured = v; return this; }
        public Builder colors(List<String> v) { p.colors = v; return this; }
        public Builder rating(Double v) { p.rating = v; return this; }
        public Builder reviewsCount(Integer v) { p.reviewsCount = v; return this; }
        public Builder activo(boolean v) { p.activo = v; return this; }
        public Producto build() { return p; }
    }

    @PrePersist
    public void prePersist() {
        this.fechaCreacion = LocalDateTime.now();
        this.fechaActualizacion = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.fechaActualizacion = LocalDateTime.now();
    }

    // ---------- Getters y setters ----------

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public String getCategoryLabel() { return categoryLabel; }
    public void setCategoryLabel(String categoryLabel) { this.categoryLabel = categoryLabel; }

    public BigDecimal getPrecio() { return precio; }
    public void setPrecio(BigDecimal precio) { this.precio = precio; }

    public BigDecimal getPrecioOriginal() { return precioOriginal; }
    public void setPrecioOriginal(BigDecimal precioOriginal) { this.precioOriginal = precioOriginal; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getShortDescription() { return shortDescription; }
    public void setShortDescription(String shortDescription) { this.shortDescription = shortDescription; }

    public String getFullDescription() { return fullDescription; }
    public void setFullDescription(String fullDescription) { this.fullDescription = fullDescription; }

    public List<String> getMaterials() { return materials; }
    public void setMaterials(List<String> materials) { this.materials = materials; }

    public String getDimensions() { return dimensions; }
    public void setDimensions(String dimensions) { this.dimensions = dimensions; }

    public String getTimeToMake() { return timeToMake; }
    public void setTimeToMake(String timeToMake) { this.timeToMake = timeToMake; }

    public boolean isInStock() { return inStock; }
    public void setInStock(boolean inStock) { this.inStock = inStock; }

    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) { this.featured = featured; }

    public List<String> getColors() { return colors; }
    public void setColors(List<String> colors) { this.colors = colors; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getReviewsCount() { return reviewsCount; }
    public void setReviewsCount(Integer reviewsCount) { this.reviewsCount = reviewsCount; }

    public boolean isActivo() { return activo; }
    public void setActivo(boolean activo) { this.activo = activo; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public LocalDateTime getFechaActualizacion() { return fechaActualizacion; }
    public void setFechaActualizacion(LocalDateTime fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }
}
