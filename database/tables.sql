CREATE DATABASE IF NOT EXISTS clothing_store;
USE clothing_store;

-- Tabla de Usuarios con ENUM para roles
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT, -- ID único del usuario
    name VARCHAR(255) NOT NULL, -- Nombre del usuario
    email VARCHAR(255) NOT NULL UNIQUE, -- Correo electrónico del usuario
    recovery_email VARCHAR(255), -- Correo electrónico de recuperación
    birthdate DATE, -- Fecha de nacimiento
    password VARCHAR(255) NOT NULL, -- Contraseña encriptada (usar bcrypt)
    role ENUM('ADMIN', 'MODERATOR', 'STORE_OWNER', 'DELIVERY_OWNER', 'USER') NOT NULL DEFAULT 'USER', -- Rol del usuario
    location VARCHAR(255), -- Ubicación del usuario (ciudad/país o coordenadas)
    account_status ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') DEFAULT 'ACTIVE', -- Estado de la cuenta
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Fecha de registro
    two_factor_secret VARCHAR(64), -- Clave secreta de 2FA
);

-- Tabla para registrar los dispositivos en los que se inicia sesión
CREATE TABLE user_devices (
    id INT PRIMARY KEY AUTO_INCREMENT, -- ID único del registro
    user_id INT NOT NULL, -- ID del usuario que inició sesión
    device_name VARCHAR(255) NOT NULL, -- Nombre del dispositivo (Ej: "iPhone 13", "MacBook Pro M1")
    ip_address VARCHAR(45) NOT NULL, -- Dirección IP de inicio de sesión
    user_agent TEXT NOT NULL, -- Información del navegador y sistema operativo
    location VARCHAR(255), -- Ubicación aproximada del inicio de sesión
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha y hora del inicio de sesión
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE -- FK al usuario
);

-- Tabla de Categorías
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT, -- ID único de la categoría
    name VARCHAR(255) NOT NULL UNIQUE, -- Nombre de la categoría
    gender ENUM('MALE', 'FEMALE', 'UNISEX') NOT NULL -- Género aplicable (masculino, femenino, unisex)
);

-- Tabla de Productos
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT, -- ID único del producto
    name VARCHAR(255) NOT NULL, -- Nombre del producto
    description TEXT, -- Descripción del producto
    price DECIMAL(10, 2) NOT NULL, -- Precio del producto
    stock INT NOT NULL, -- Cantidad en inventario
    image_id VARCHAR(255), -- Referencia a la imagen en MongoDB
    category_id INT, -- Categoría principal del producto (ahora puede ser NULL)
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL ON UPDATE CASCADE -- FK a categorías
);

-- Tabla de Pedidos
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT, -- ID único del pedido
    user_id INT NOT NULL, -- Usuario que realizó el pedido
    order_status ENUM('PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED') DEFAULT 'PENDING', -- Estado del pedido
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha del pedido
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE -- FK al usuario
);

-- Tabla de Detalles de Pedidos
CREATE TABLE order_items (
    order_id INT NOT NULL, -- ID del pedido
    product_id INT NOT NULL, -- Producto incluido en el pedido
    quantity INT NOT NULL, -- Cantidad del producto
    price DECIMAL(10, 2) NOT NULL, -- Precio del producto al momento del pedido
    PRIMARY KEY (order_id, product_id), -- Clave primaria compuesta
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE, -- FK al pedido
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE -- FK al producto
);

-- Tabla de Métodos de Pago
CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT, -- ID único del pago
    order_id INT NOT NULL, -- Pedido asociado al pago
    payment_method ENUM('CREDIT_CARD', 'PAYPAL', 'BANK_TRANSFER') NOT NULL, -- Método de pago
    payment_status ENUM('COMPLETED', 'PENDING', 'FAILED') DEFAULT 'PENDING', -- Estado del pago
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE -- FK al pedido
);

-- Tabla de Direcciones de Envío
CREATE TABLE shipping_addresses (
    id INT PRIMARY KEY AUTO_INCREMENT, -- ID único de la dirección
    order_id INT NOT NULL, -- Pedido asociado
    address TEXT NOT NULL, -- Dirección de envío
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE -- FK al pedido
);

-- Tabla de Carritos
CREATE TABLE carts (
    id INT PRIMARY KEY AUTO_INCREMENT, -- ID único del carrito
    user_id INT NOT NULL, -- Usuario asociado al carrito
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE -- FK al usuario
);

-- Tabla de Productos en el Carrito
CREATE TABLE cart_items (
    cart_id INT NOT NULL, -- ID del carrito
    product_id INT NOT NULL, -- Producto en el carrito
    quantity INT NOT NULL, -- Cantidad del producto
    price DECIMAL(10, 2) NOT NULL, -- Precio del producto
    PRIMARY KEY (cart_id, product_id), -- Clave primaria compuesta
    FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE ON UPDATE CASCADE, -- FK al carrito
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE -- FK al producto
);

-- Tabla de Reseñas de Productos
CREATE TABLE reviews (
    id INT PRIMARY KEY AUTO_INCREMENT, -- ID único de la reseña
    product_id INT NOT NULL, -- Producto reseñado
    user_id INT NOT NULL, -- Usuario que realizó la reseña
    rating INT CHECK (rating BETWEEN 1 AND 5), -- Calificación (1-5)
    comment TEXT, -- Comentario opcional
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE, -- FK al producto
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE -- FK al usuario
);

-- Tabla de Descuentos
CREATE TABLE discounts (
    id INT PRIMARY KEY AUTO_INCREMENT, -- ID único del descuento
    code VARCHAR(50) NOT NULL UNIQUE, -- Código del descuento
    discount_percentage DECIMAL(5, 2) NOT NULL, -- Porcentaje de descuento
    valid_until DATE -- Fecha límite de validez
);