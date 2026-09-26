package com.crochet.api.repository;

import com.crochet.api.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findByActivoTrue();
    List<Producto> findByCategoriaIgnoreCaseAndActivoTrue(String categoria);
}
