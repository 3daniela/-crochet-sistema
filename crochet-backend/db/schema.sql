-- =====================================================================
-- Script de base de datos: Croché con Amor
-- MySQL 8.x (compatible con Railway)
--
-- Este script es EQUIVALENTE al esquema que Hibernate generaría
-- automáticamente (spring.jpa.hibernate.ddl-auto=update) a partir de las
-- entidades Java. Se entrega como script manual para poder:
--   1) Ejecutarlo y revisarlo en MySQL Workbench antes de correr el backend.
--   2) Sustentar el diseño de la base de datos de forma explícita.
--
-- Si el backend ya creó las tablas automáticamente, puedes saltar la
-- sección de CREATE TABLE y ejecutar solo los INSERT (sección 2).
-- =====================================================================

-- ---------------------------------------------------------------------
-- 0. (Opcional) Crear y usar la base de datos
-- ---------------------------------------------------------------------
-- CREATE DATABASE IF NOT EXISTS railway CHARACTER SET utf8mb4;
-- USE railway;

-- =====================================================================
-- 1. ESQUEMA (tablas)
-- =====================================================================

-- ---------------------------------------------------------------------
-- Tabla: usuarios
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre          VARCHAR(100)  NOT NULL,
    email           VARCHAR(150)  NOT NULL,
    password        VARCHAR(100)  NOT NULL,   -- hash BCrypt (60 caracteres)
    rol             VARCHAR(20)   NOT NULL,   -- 'ADMIN' | 'CLIENTE'
    phone           VARCHAR(30),
    city            VARCHAR(100),
    fecha_creacion  DATETIME      NOT NULL,
    activo          TINYINT(1)    NOT NULL DEFAULT 1,
    CONSTRAINT uq_usuarios_email UNIQUE (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- Tabla: categorias
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categorias (
    id           VARCHAR(50)   PRIMARY KEY,   -- slug, ej: 'macrame'
    title        VARCHAR(150)  NOT NULL,
    subtitle     VARCHAR(200),
    image        VARCHAR(500),
    count_label  VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- Tabla: productos
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS productos (
    id                    BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre                VARCHAR(200)   NOT NULL,
    categoria             VARCHAR(50)    NOT NULL,  -- amigurumis|bolsos|prendas|hogar|macrame
    category_label        VARCHAR(150),
    precio                DECIMAL(10,2)  NOT NULL,
    precio_original       DECIMAL(10,2),
    image                 VARCHAR(500),
    short_description     VARCHAR(500),
    full_description      TEXT,
    dimensions            VARCHAR(200),
    time_to_make          VARCHAR(100),
    in_stock              TINYINT(1)     NOT NULL DEFAULT 1,
    featured              TINYINT(1)     NOT NULL DEFAULT 0,
    rating                DECIMAL(3,2),
    reviews_count         INT,
    activo                TINYINT(1)     NOT NULL DEFAULT 1,
    fecha_creacion        DATETIME       NOT NULL,
    fecha_actualizacion   DATETIME,
    CONSTRAINT fk_producto_categoria FOREIGN KEY (categoria) REFERENCES categorias(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- Tabla: producto_materiales (colección @ElementCollection de JPA)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS producto_materiales (
    producto_id  BIGINT       NOT NULL,
    material     VARCHAR(200) NOT NULL,
    CONSTRAINT fk_material_producto FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- Tabla: producto_colores (colección @ElementCollection de JPA)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS producto_colores (
    producto_id  BIGINT       NOT NULL,
    color        VARCHAR(200) NOT NULL,
    CONSTRAINT fk_color_producto FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================================
-- 2. DATOS SEMILLA (los mismos del mock del frontend)
-- =====================================================================

-- ---------------------------------------------------------------------
-- 2.1 Usuarios de prueba
--   Contraseñas hasheadas con BCrypt, factor de costo 12 (idéntico al
--   BCryptPasswordEncoder(12) configurado en SecurityConfig.java).
--
--   admin@crocheconamor.com    / Admin123!     -> rol ADMIN
--   camila@crocheconamor.com   / Demo1234!      -> rol CLIENTE (usada por el botón "Acceso Demo")
--   cliente@correo.com         / Cliente123!    -> rol CLIENTE
-- ---------------------------------------------------------------------
INSERT INTO usuarios (nombre, email, password, rol, phone, city, fecha_creacion, activo) VALUES
('Administrador Croché', 'admin@crocheconamor.com',
 '$2b$12$.Af5y8ggvlskqEsZMQoTM.4O5hL.dtRg7SsyyOg8UtM/zYNvkBa8.',
 'ADMIN', '+57 300 000 0000', 'Bogotá, Colombia', NOW(), 1),

('Camila Artesana', 'camila@crocheconamor.com',
 '$2b$12$bO.vCtVM.fXuqH6V8vpn4Ox9nfnPhOXy25cT0n/MZUgoVb3nbuEt2',
 'CLIENTE', '+57 300 456 7890', 'Medellín, Colombia', NOW(), 1),

('Cliente de Prueba', 'cliente@correo.com',
 '$2b$12$hWzlI7FWH3iCzZ642zMkpuXsI8PcU1UUROmgBRzUH/ot4Ipi5UbrW',
 'CLIENTE', '+57 310 987 6543', 'Cali, Colombia', NOW(), 1);

-- ---------------------------------------------------------------------
-- 2.2 Categorías (idénticas a CATEGORIES_DATA del frontend)
-- ---------------------------------------------------------------------
INSERT INTO categorias (id, title, subtitle, image, count_label) VALUES
('macrame',   'Macramé Boho',        'Tapices & Nudos en Algodón',              '/images/macrame_wall_hanging_1789775450837.jpg',  'Murales & Colgadores'),
('bolsos',    'Bolsos & Totes',      'Técnica Granny Square',                   '/images/crochet_bag_granny_1789706152328.jpg',    'Diseños de Autor'),
('amigurumis','Amigurumis Dulces',   'Muñecos de Apego Hipoalergénicos',        '/images/crochet_amigurumi_1789706162251.jpg',     'Para regalar y coleccionar'),
('prendas',   'Prendas & Chalecos',  'Slow-fashion Cálido y Cómodo',            '/images/crochet_cardigan_1789706172786.jpg',      'Tallas a medida'),
('hogar',     'Hogar & Mantas',      'Calidez en Cada Rincón',                  '/images/crochet_hero_artisan_1789706140321.jpg',  'Reliquias familiares');

-- ---------------------------------------------------------------------
-- 2.3 Productos (idénticos a PRODUCTS_DATA del frontend)
-- ---------------------------------------------------------------------
INSERT INTO productos
(nombre, categoria, category_label, precio, precio_original, image, short_description, full_description,
 dimensions, time_to_make, in_stock, featured, rating, reviews_count, activo, fecha_creacion, fecha_actualizacion)
VALUES
('Bolso Tote Granny Square Floral', 'bolsos', 'Bolsos & Accesorios', 145000, 170000,
 '/images/crochet_bag_granny_1789706152328.jpg',
 'Bolso artesanal confeccionado con unión de granny squares en tonos cálidos y forro interior reforzado.',
 'Nuestro icónico bolso tote granny square combina la tradición del tejido vintage con la frescura moderna. Confeccionado 100% a mano con hilo de algodón mercerizado de primera calidad en tonos rosa pastel, durazno, mostaza y crema. Cuenta con forro interior de lino crudo y asas reforzadas con doble puntada.',
 '38 cm alto x 34 cm ancho (Asas: 28 cm caída)', '5 a 7 días hábiles', 1, 1, 4.9, 38, 1, NOW(), NOW()),

('Osito Amigurumi Dulce Abrazo', 'amigurumis', 'Amigurumis', 95000, 110000,
 '/images/crochet_amigurumi_1789706162251.jpg',
 'Muñeco de apego tejido a mano en hilo hipoalergénico con ojos de seguridad y bufanda desmontable.',
 'El compañero perfecto para los más pequeños o un regalo emotivo para alguien especial. Tejido con la técnica japonesa del amigurumi en puntada apretada con hilo de algodón 100% peinado e hipoalergénico. Relleno con fibra siliconada lavable y ojitos con broche de seguridad a presión aptos para bebés.',
 '22 cm alto x 14 cm ancho', '3 a 4 días hábiles', 1, 1, 5.0, 52, 1, NOW(), NOW()),

('Cardigan Granny Garden Hecho a Mano', 'prendas', 'Prendas & Chalecos', 265000, 295000,
 '/images/crochet_cardigan_1789706172786.jpg',
 'Chaqueta tejida con mangas globo y detalles de flores granny square en tonos cálidos y acogedores.',
 'Una prenda de autor que celebra la belleza del crochet slow-fashion. Tejida con una combinación de punto alto y cuadrados de la abuela en tonalidades atardecer: coral, crema, caramelo y rosa. Caída holgada (oversize), liviana pero abrigadora, ideal para cualquier temporada.',
 'Talla única oversize (Busto: hasta 110 cm / Largo: 62 cm)', '8 a 12 días hábiles', 1, 1, 4.9, 27, 1, NOW(), NOW()),

('Manta Reliquia Familiar con Amor', 'hogar', 'Hogar & Mantas', 340000, 380000,
 '/images/crochet_hero_artisan_1789706140321.jpg',
 'Manta decorativa para sillón o cama con patrón clásico de granny squares y ribete festoneado.',
 'Creada para ser una reliquia en tu hogar. Cada cuadrado ha sido tejido con esmero y paciencia, ensamblado punto a punto para una durabilidad de décadas. Brinda calidez inmediata en las tardes de descanso o lectura con una suavidad envolvente.',
 '130 cm ancho x 160 cm largo', '10 a 14 días hábiles', 1, 1, 5.0, 19, 1, NOW(), NOW()),

('Tapiz Mural Boho Aurora en Macramé', 'macrame', 'Macramé & Decoración', 165000, 190000,
 '/images/macrame_wall_hanging_1789775450837.jpg',
 'Tapiz de pared tejido con cordón de algodón natural, nudos planos, rombos y flecos sobre rama de madera pulida.',
 'Majestuoso tapiz de pared estilo bohemio anudado a mano con paciencia y precisión. Cada pieza se sostiene sobre una rama de madera natural pulida y tratada artesanalmente. Su patrón de nudos planos, rombos y trenzas culmina en una cascada de flecos peinados que aporta calidez inmediata a dormitorios o salas.',
 '65 cm largo x 45 cm ancho de madera', '4 a 6 días hábiles', 1, 1, 5.0, 34, 1, NOW(), NOW()),

('Colgador de Plantas Botánico en Macramé', 'macrame', 'Macramé & Botánica', 68000, 78000,
 '/images/macrame_plant_hanger_1789775464328.jpg',
 'Portamacetas colgante elaborado con nudo espiral y aro de madera, ideal para macetas medianas de 12 a 22 cm.',
 'El accesorio decorativo imprescindible para tus plantas favoritas. Confeccionado con cuerdas de algodón resistente mediante nudos espirales y nudos planos, rematado con un aro de madera de haya maciza para colgar fácilmente del techo o pared y borla frondosa inferior.',
 '95 cm largo total', '2 a 3 días hábiles', 1, 1, 4.9, 41, 1, NOW(), NOW()),

('Bolso Boho Macramé con Asas Circulares de Madera', 'macrame', 'Macramé & Bolsos', 155000, 180000,
 '/images/macrame_bag_combo_1789775475657.jpg',
 'Bolso artesanal anudado a mano con nudos entrelazados, asas de madera pulida y forro interior protector de lino.',
 'Una creación donde el encanto del macramé y la practicidad se dan la mano. Estructura anudada con cordón de algodón suave de tacto agradable, equipada con asas circulares de madera y forro interior cosido a mano con bolsillito para llaves y móvil.',
 '34 cm ancho x 30 cm alto (sin asas)', '5 a 7 días hábiles', 1, 1, 4.9, 28, 1, NOW(), NOW());

-- ---------------------------------------------------------------------
-- 2.4 Materiales y colores de cada producto
--   (usamos LAST_INSERT_ID()-based lookups por nombre para no depender
--    de IDs fijos; si prefieres, ejecútalo justo después del bloque
--    anterior en la misma sesión)
-- ---------------------------------------------------------------------
INSERT INTO producto_materiales (producto_id, material)
SELECT id, m.material FROM productos p
JOIN (
    SELECT 'Bolso Tote Granny Square Floral' AS nombre, '100% Algodón Mercerizado' AS material UNION ALL
    SELECT 'Bolso Tote Granny Square Floral', 'Forro interior de lino' UNION ALL
    SELECT 'Bolso Tote Granny Square Floral', 'Asas ergonómicas tejidas' UNION ALL

    SELECT 'Osito Amigurumi Dulce Abrazo', 'Hilo de algodón hipoalergénico' UNION ALL
    SELECT 'Osito Amigurumi Dulce Abrazo', 'Ojos de seguridad certificados' UNION ALL
    SELECT 'Osito Amigurumi Dulce Abrazo', 'Vellón siliconado antipolvo' UNION ALL

    SELECT 'Cardigan Granny Garden Hecho a Mano', 'Mezcla suave algodón y acrílico premium' UNION ALL
    SELECT 'Cardigan Granny Garden Hecho a Mano', 'Botones de madera natural grabados' UNION ALL
    SELECT 'Cardigan Granny Garden Hecho a Mano', 'Terminaciones a mano' UNION ALL

    SELECT 'Manta Reliquia Familiar con Amor', '100% Algodón peinado extra suave' UNION ALL
    SELECT 'Manta Reliquia Familiar con Amor', 'Borde feston festoneado' UNION ALL
    SELECT 'Manta Reliquia Familiar con Amor', 'Tratamiento anti-pilling' UNION ALL

    SELECT 'Tapiz Mural Boho Aurora en Macramé', 'Cordón de algodón natural 4mm 100% biodegradable' UNION ALL
    SELECT 'Tapiz Mural Boho Aurora en Macramé', 'Rama de madera natural seleccionada y curada' UNION ALL
    SELECT 'Tapiz Mural Boho Aurora en Macramé', 'Flecos peinados al detalle' UNION ALL

    SELECT 'Colgador de Plantas Botánico en Macramé', 'Cuerda de algodón peinado 3mm reforzada' UNION ALL
    SELECT 'Colgador de Plantas Botánico en Macramé', 'Aro de madera de haya natural' UNION ALL
    SELECT 'Colgador de Plantas Botánico en Macramé', 'Remate con nudo de corona' UNION ALL

    SELECT 'Bolso Boho Macramé con Asas Circulares de Madera', 'Cordón de algodón 100% de 3mm' UNION ALL
    SELECT 'Bolso Boho Macramé con Asas Circulares de Madera', 'Asas redondas de madera barnizada' UNION ALL
    SELECT 'Bolso Boho Macramé con Asas Circulares de Madera', 'Forro interior de lino crudo con cremallera'
) m ON m.nombre = p.nombre;

INSERT INTO producto_colores (producto_id, color)
SELECT id, c.color FROM productos p
JOIN (
    SELECT 'Bolso Tote Granny Square Floral' AS nombre, 'Paleta Cálida Floral' AS color UNION ALL
    SELECT 'Bolso Tote Granny Square Floral', 'Crema y Terracota' UNION ALL
    SELECT 'Bolso Tote Granny Square Floral', 'Rosa Suave' UNION ALL

    SELECT 'Osito Amigurumi Dulce Abrazo', 'Miel y Durazno' UNION ALL
    SELECT 'Osito Amigurumi Dulce Abrazo', 'Beige Natural' UNION ALL
    SELECT 'Osito Amigurumi Dulce Abrazo', 'Rosa Vintage' UNION ALL

    SELECT 'Cardigan Granny Garden Hecho a Mano', 'Tonos Atardecer' UNION ALL
    SELECT 'Cardigan Granny Garden Hecho a Mano', 'Crema y Dulce de Leche' UNION ALL

    SELECT 'Manta Reliquia Familiar con Amor', 'Crema, Rosa y Miel' UNION ALL
    SELECT 'Manta Reliquia Familiar con Amor', 'Pasteles Cálidos' UNION ALL

    SELECT 'Tapiz Mural Boho Aurora en Macramé', 'Crudo Natural Bohemio' UNION ALL
    SELECT 'Tapiz Mural Boho Aurora en Macramé', 'Crudo y Terracota Suave' UNION ALL
    SELECT 'Tapiz Mural Boho Aurora en Macramé', 'Crudo y Rosa Palo' UNION ALL

    SELECT 'Colgador de Plantas Botánico en Macramé', 'Blanco Crudo Natural' UNION ALL
    SELECT 'Colgador de Plantas Botánico en Macramé', 'Verde Oliva Suave' UNION ALL
    SELECT 'Colgador de Plantas Botánico en Macramé', 'Mostaza Cálido' UNION ALL

    SELECT 'Bolso Boho Macramé con Asas Circulares de Madera', 'Crudo Bohemio Natural' UNION ALL
    SELECT 'Bolso Boho Macramé con Asas Circulares de Madera', 'Miel & Crema'
) c ON c.nombre = p.nombre;

-- =====================================================================
-- 3. Verificación rápida
-- =====================================================================
-- SELECT * FROM usuarios;
-- SELECT * FROM categorias;
-- SELECT id, nombre, categoria, precio, in_stock, featured FROM productos;
-- SELECT * FROM producto_materiales;
-- SELECT * FROM producto_colores;
