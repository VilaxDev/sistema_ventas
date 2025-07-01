-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 01-07-2025 a las 18:32:30
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `sistema_ventas`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalles_venta`
--

CREATE TABLE `detalles_venta` (
  `id` int(11) NOT NULL,
  `venta_id` int(11) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalles_venta`
--

INSERT INTO `detalles_venta` (`id`, `venta_id`, `producto_id`, `cantidad`, `precio_unitario`, `subtotal`) VALUES
(1, 1, 8, 10, 1.00, 10.00),
(2, 1, 7, 3, 1.50, 4.50),
(3, 1, 2, 3, 3.75, 11.25),
(4, 1, 4, 3, 0.75, 2.25),
(5, 2, 8, 10, 1.00, 10.00),
(6, 2, 6, 1, 2.20, 2.20),
(7, 2, 7, 1, 1.50, 1.50),
(8, 2, 4, 1, 0.75, 0.75),
(9, 3, 5, 1, 1.25, 1.25),
(10, 3, 3, 1, 1.80, 1.80),
(11, 3, 6, 1, 2.20, 2.20),
(12, 4, 6, 1, 2.20, 2.20),
(13, 4, 7, 1, 1.50, 1.50),
(14, 4, 5, 1, 1.25, 1.25),
(15, 5, 8, 5, 1.00, 5.00),
(16, 5, 6, 2, 2.20, 4.40),
(17, 5, 2, 1, 3.75, 3.75),
(18, 6, 7, 3, 1.50, 4.50);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `imagen` varchar(255) DEFAULT NULL,
  `categoria` varchar(50) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `nombre`, `descripcion`, `precio`, `stock`, `imagen`, `categoria`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 'Arroz', 'Arroz blanco de grano largo', 2.50, 100, NULL, 'Alimentos', '2025-05-28 20:22:40', '2025-05-28 20:22:40'),
(2, 'Aceite', 'Aceite vegetal 1L', 3.75, 46, NULL, 'Alimentos', '2025-05-28 20:22:40', '2025-07-01 16:09:56'),
(3, 'Azúcar', 'Azúcar blanca 1kg', 1.80, 79, NULL, 'Alimentos', '2025-05-28 20:22:40', '2025-07-01 15:33:39'),
(4, 'Sal', 'Sal de mesa 500g', 0.75, 116, NULL, 'Alimentos', '2025-05-28 20:22:40', '2025-05-28 20:54:14'),
(5, 'Pasta', 'Pasta espagueti 500g', 1.25, 58, NULL, 'Alimentos', '2025-05-28 20:22:40', '2025-07-01 15:55:35'),
(6, 'Atún', 'Atún en lata', 2.20, 35, NULL, 'Conservas', '2025-05-28 20:22:40', '2025-07-01 16:09:56'),
(7, 'Leche', 'Leche entera 1L', 1.50, 22, NULL, 'Lácteos', '2025-05-28 20:22:40', '2025-07-01 16:23:17'),
(8, 'Pan', 'Pan integral', 1.00, 5, NULL, 'Panadería', '2025-05-28 20:22:40', '2025-07-01 16:18:15'),
(9, 'Chocolate', 'Chocolate en barra de mrbeast', 10.00, 20, NULL, 'Alimentos', '2025-07-01 16:20:56', '2025-07-01 16:21:27');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas`
--

CREATE TABLE `ventas` (
  `id` int(11) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `fecha_venta` timestamp NOT NULL DEFAULT current_timestamp(),
  `cliente_nombre` varchar(100) DEFAULT NULL,
  `cliente_email` varchar(100) DEFAULT NULL,
  `estado` enum('pendiente','completada','cancelada') DEFAULT 'completada'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ventas`
--

INSERT INTO `ventas` (`id`, `total`, `fecha_venta`, `cliente_nombre`, `cliente_email`, `estado`) VALUES
(1, 28.00, '2025-05-28 20:42:22', 'Wilmer vila', 'vilax.dev@gmail.com', 'completada'),
(2, 14.45, '2025-05-28 20:54:14', 'Pichon', 'pichon43@gmail.com', 'completada'),
(3, 5.25, '2025-07-01 15:33:39', 'Jhon Castro Valle', 'valle.castro@gmail.com', 'completada'),
(4, 4.95, '2025-07-01 15:55:35', 'Beny Max Estrada', 'max.extrada@gmail.com', 'completada'),
(5, 13.15, '2025-07-01 16:09:56', 'Lola Pakin estrada', 'estrada.lola@gmail.com', 'completada'),
(6, 4.50, '2025-07-01 16:23:17', 'Yoana Pariona Campos', 'campos.pariona@gmail.com', 'completada');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `detalles_venta`
--
ALTER TABLE `detalles_venta`
  ADD PRIMARY KEY (`id`),
  ADD KEY `venta_id` (`venta_id`),
  ADD KEY `producto_id` (`producto_id`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `detalles_venta`
--
ALTER TABLE `detalles_venta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `ventas`
--
ALTER TABLE `ventas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `detalles_venta`
--
ALTER TABLE `detalles_venta`
  ADD CONSTRAINT `detalles_venta_ibfk_1` FOREIGN KEY (`venta_id`) REFERENCES `ventas` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `detalles_venta_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
