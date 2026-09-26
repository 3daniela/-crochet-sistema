package com.crochet.api.model;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

/**
 * Usuario del sistema. Implementa UserDetails para que Spring Security
 * pueda usarlo directamente en el proceso de autenticacion.
 *
 * La contrasena NUNCA se guarda en texto plano: se persiste el hash
 * generado por BCryptPasswordEncoder (ver SecurityConfig).
 *
 * Nota: esta clase NO usa Lombok a proposito, para que el proyecto
 * compile igual en cualquier IDE (Eclipse/STS, IntelliJ, VS Code) sin
 * necesidad de instalar el plugin de Lombok.
 */
@Entity
@Table(name = "usuarios", uniqueConstraints = @UniqueConstraint(columnNames = "email"))
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    /** Hash BCrypt de la contrasena (60 caracteres). Nunca texto plano. */
    @Column(nullable = false, length = 100)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Rol rol;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(nullable = false)
    private boolean activo = true;

    @Column(length = 30)
    private String phone;

    @Column(length = 100)
    private String city;

    public Usuario() {
    }

    public Usuario(Long id, String nombre, String email, String password, Rol rol,
                    LocalDateTime fechaCreacion, boolean activo) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.password = password;
        this.rol = rol;
        this.fechaCreacion = fechaCreacion;
        this.activo = activo;
    }

    /** Builder sencillo, escrito a mano (equivalente al @Builder de Lombok). */
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final Usuario usuario = new Usuario();

        public Builder nombre(String nombre) { usuario.nombre = nombre; return this; }
        public Builder email(String email) { usuario.email = email; return this; }
        public Builder password(String password) { usuario.password = password; return this; }
        public Builder rol(Rol rol) { usuario.rol = rol; return this; }
        public Builder activo(boolean activo) { usuario.activo = activo; return this; }
        public Builder phone(String phone) { usuario.phone = phone; return this; }
        public Builder city(String city) { usuario.city = city; return this; }
        public Usuario build() { return usuario; }
    }

    @PrePersist
    public void prePersist() {
        this.fechaCreacion = LocalDateTime.now();
    }

    // ---------- Getters y setters ----------

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public void setPassword(String password) { this.password = password; }

    public Rol getRol() { return rol; }
    public void setRol(Rol rol) { this.rol = rol; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public boolean isActivo() { return activo; }
    public void setActivo(boolean activo) { this.activo = activo; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    // ---------- Metodos requeridos por UserDetails ----------

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Spring Security espera el prefijo "ROLE_" para hasRole("ADMIN")
        return List.of(new SimpleGrantedAuthority("ROLE_" + rol.name()));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return activo;
    }
}
