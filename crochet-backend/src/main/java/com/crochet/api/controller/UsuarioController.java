package com.crochet.api.controller;

import com.crochet.api.dto.UsuarioResponse;
import com.crochet.api.model.Usuario;
import com.crochet.api.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;

    public UsuarioController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    /** Perfil del usuario actualmente autenticado (cualquier rol). */
    @GetMapping("/api/perfil")
    public ResponseEntity<UsuarioResponse> perfil(@AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(UsuarioResponse.fromEntity(usuario));
    }

    /** Listado de usuarios: protegido a nivel de SecurityConfig (solo ADMIN). */
    @GetMapping("/api/usuarios")
    public ResponseEntity<List<UsuarioResponse>> listar() {
        List<UsuarioResponse> usuarios = usuarioRepository.findAll().stream()
                .map(UsuarioResponse::fromEntity)
                .toList();
        return ResponseEntity.ok(usuarios);
    }
}
