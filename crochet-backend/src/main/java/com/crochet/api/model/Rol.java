package com.crochet.api.model;

/**
 * Roles del sistema. Se usan tal cual con el prefijo ROLE_ que exige
 * Spring Security al evaluar hasRole()/hasAuthority().
 */
public enum Rol {
    ADMIN,
    CLIENTE
}
