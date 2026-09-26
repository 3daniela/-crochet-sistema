package com.crochet.api.model;

import jakarta.persistence.*;

/**
 * Coincide con la interfaz TypeScript:
 * export interface Category { id: string; title: string; subtitle: string; image: string; count: string; }
 *
 * El "id" aqui es un identificador legible (slug), no autonumerico,
 * ej: "macrame", "bolsos", "amigurumis"... porque el frontend lo usa
 * como valor del campo "category" de cada producto.
 */
@Entity
@Table(name = "categorias")
public class Categoria {

    @Id
    @Column(length = 50)
    private String id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(length = 200)
    private String subtitle;

    @Column(length = 500)
    private String image;

    @Column(name = "count_label", length = 100)
    private String count;

    public Categoria() {
    }

    public Categoria(String id, String title, String subtitle, String image, String count) {
        this.id = id;
        this.title = title;
        this.subtitle = subtitle;
        this.image = image;
        this.count = count;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSubtitle() { return subtitle; }
    public void setSubtitle(String subtitle) { this.subtitle = subtitle; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getCount() { return count; }
    public void setCount(String count) { this.count = count; }
}
