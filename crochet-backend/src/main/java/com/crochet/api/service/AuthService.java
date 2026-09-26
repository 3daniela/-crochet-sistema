package com.crochet.api.service;

import com.crochet.api.dto.AuthResponse;
import com.crochet.api.dto.LoginRequest;
import com.crochet.api.dto.RegisterRequest;
import com.crochet.api.dto.UsuarioResponse;
import com.crochet.api.model.Rol;
import com.crochet.api.model.Usuario;
import com.crochet.api.repository.UsuarioRepository;
import com.crochet.api.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder,
                        JwtService jwtService, AuthenticationManager authenticationManager) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    /**
     * Registro de un nuevo cliente. Los administradores no se crean por esta
     * via publica; se crean manualmente en BD (ver script SQL) o se asciende
     * un usuario existente con un UPDATE.
     */
    public AuthResponse register(RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Ya existe un usuario registrado con ese email");
        }

        Usuario usuario = Usuario.builder()
                .nombre(request.name())
                .email(request.email())
                // Aqui ocurre el hasheo: BCrypt genera salt + hash en una sola llamada.
                .password(passwordEncoder.encode(request.password()))
                .phone(request.phone())
                .city(request.city())
                .rol(Rol.CLIENTE)
                .activo(true)
                .build();

        usuarioRepository.save(usuario);

        return construirRespuesta(usuario);
    }

    /**
     * Login: delega la verificacion de credenciales en el AuthenticationManager,
     * que internamente usa DaoAuthenticationProvider + BCryptPasswordEncoder
     * para comparar el hash guardado contra la contrasena recibida.
     */
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        Usuario usuario = usuarioRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalArgumentException("Credenciales invalidas"));

        return construirRespuesta(usuario);
    }

    private AuthResponse construirRespuesta(Usuario usuario) {
        String token = jwtService.generateToken(usuario, usuario.getRol().name());
        return new AuthResponse(token, "Bearer", jwtService.getExpirationMs(),
                UsuarioResponse.fromEntity(usuario));
    }
}
