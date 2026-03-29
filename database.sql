CREATE DATABASE IF NOT EXISTS `emenu_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `emenu_db`;

SET FOREIGN_KEY_CHECKS=0;

--
-- Table structure for table `categories`
--
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--
INSERT INTO `categories` (`id`, `name`, `image_url`) VALUES
(1, 'Khai vị', 'https://images.unsplash.com/photo-1541014741259-de529411b96a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'),
(2, 'Món chính', 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'),
(3, 'Đồ uống', 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'),
(4, 'Tráng miệng', 'https://images.unsplash.com/photo-1551024506-0cb9842cbdb2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3');

--
-- Table structure for table `food_items`
--
DROP TABLE IF EXISTS `food_items`;
CREATE TABLE `food_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,0) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL, -- Comma separated like 'cay,chay,bestseller'
  PRIMARY KEY (`id`),
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `food_items`
--
INSERT INTO `food_items` (`id`, `category_id`, `name`, `description`, `price`, `image_url`, `tags`) VALUES
(1, 1, 'Salad Cá Hồi', 'Cá hồi tươi, xà lách, sốt chanh leo chua ngọt thơm mát.', 120000, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=60&w=500', 'bestseller'),
(2, 1, 'Sup Măng Tây Cua', 'Sup nấu cùng măng tây và thịt cua biển Cà Mau.', 85000, 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=60&w=500', ''),
(3, 2, 'Bò Bít Tết (Ribeye)', 'Thăn lưng bò Úc nướng sốt tiêu đen, kèm khoai tây chiên.', 350000, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800', 'bestseller'),
(4, 2, 'Mì Ý Hải Sản', 'Mì Ý sốt cà chua cay nhẹ cùng tôm sú, mực, và phi lê cá.', 180000, 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&q=60&w=500', 'cay'),
(5, 2, 'Cơm Nấm Trầm Hương', 'Cơm rang nấm chay thơm lừng.', 90000, 'https://images.unsplash.com/photo-1533622597524-a1215e26c0a2?auto=format&fit=crop&q=60&w=500', 'chay'),
(6, 3, 'Trà Đào Cam Sả', 'Trà thanh mát với miếng đào ngâm giòn ngọt và sả.', 45000, 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&q=60&w=500', 'bestseller'),
(7, 3, 'Nước Ép Dưa Hấu', 'Dưa hấu nguyên chất không đường giải nhiệt.', 40000, 'https://images.unsplash.com/photo-1587883012610-e3df17d41270?auto=format&fit=crop&q=80&w=800', ''),
(8, 4, 'Bánh Tiramisu', 'Bánh phô mai Ý vị cà phê mềm xốp.', 65000, 'https://images.unsplash.com/photo-1571115177098-24c42d640c9f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', 'bestseller'),
(9, 4, 'Kem Vani Hạt Macca', 'Kem ngọt thanh ngậy cùng hạt tươi giòn rụm.', 55000, 'https://images.unsplash.com/photo-1557142046-c704a3adf8ac?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', ''),
(10, 1, 'Gỏi Cuốn Tôm Thịt', 'Bánh tráng cuộn tôm sú, thịt ba chỉ, bún tươi và rau thơm.', 65000, 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', 'bestseller'),
(11, 1, 'Khoai Tây Chiên Giòn', 'Khoai tây Mỹ chiên giòn lắc phô mai.', 45000, 'https://images.unsplash.com/photo-1576107232684-1279f3908ac1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', ''),
(12, 2, 'Phở Bò Tơ', 'Phở bò tái nạm chuẩn vị Bắc với nước dùng ngọt xương.', 75000, 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', 'bestseller'),
(13, 2, 'Lẩu Thái Hải Sản', 'Lẩu chua cay kèm tôm, mực, nghêu và nấm các loại.', 350000, 'https://images.unsplash.com/photo-1555126634-ae23443a68d0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', 'cay,bestseller'),
(14, 2, 'Cơm Tấm Sườn Bì', 'Cơm tấm sườn nướng mỡ hành kim phấn.', 60000, 'https://images.unsplash.com/photo-1606850246029-dd00e529ce33?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', ''),
(15, 3, 'Trà Sữa Trân Châu', 'Trà sữa đậm vị Đài Loan cùng trân châu đen truyền thống.', 50000, 'https://images.unsplash.com/photo-1558855567-33a559d873bc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', 'bestseller'),
(16, 3, 'Sinh Tố Bơ', 'Bơ sáp Mộc Châu xay nhuyễn cùng sữa đặc.', 55000, 'https://images.unsplash.com/photo-1604724698585-7095493d5f30?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', ''),
(17, 3, 'Cafe Sữa Đá', 'Cafe phin truyền thống Việt Nam pha sữa đặc.', 35000, 'https://images.unsplash.com/photo-1579543161427-1422abda643f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', 'bestseller'),
(18, 4, 'Chè Khúc Bạch', 'Chè khúc bạch thanh mát, nhãn lồng và hạnh nhân.', 45000, 'https://images.unsplash.com/photo-1563805042-7684c8a9e9cb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', 'bestseller');

--
-- Table structure for table `restaurant_tables`
--
DROP TABLE IF EXISTS `restaurant_tables`;
CREATE TABLE `restaurant_tables` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `table_number` varchar(50) NOT NULL UNIQUE,
  `area` varchar(50) DEFAULT 'Tầng 1',
  `status` enum('Trống','Đang phục vụ') DEFAULT 'Trống',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `restaurant_tables`
--
INSERT INTO `restaurant_tables` (`table_number`, `area`) VALUES
('Bàn 01', 'Tầng 1'), ('Bàn 02', 'Tầng 1'), ('Bàn 03', 'Tầng 1'),
('VIP 01', 'Phòng VIP'), ('VIP 02', 'Phòng VIP'),
('S01', 'Sân Vườn'), ('S02', 'Sân Vườn');

--
-- Table structure for table `orders`
--
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `table_id` int(11) DEFAULT NULL,
  `table_number` varchar(50) NOT NULL,
  `area` varchar(50) DEFAULT NULL,
  `status` enum('Chờ xác nhận', 'Đang nấu', 'Đã phục vụ', 'Đã thanh toán') DEFAULT 'Chờ xác nhận',
  `total_amount` decimal(10,0) DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `order_items`
--
DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `food_item_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `options_spice` varchar(50) DEFAULT NULL,
  `options_ice` varchar(50) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `price_at_time` decimal(10,0) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `support_calls`
--
DROP TABLE IF EXISTS `support_calls`;
CREATE TABLE `support_calls` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `table_number` varchar(50) NOT NULL,
  `area` varchar(50) DEFAULT NULL,
  `status` enum('Chờ xử lý', 'Đã hỗ trợ') DEFAULT 'Chờ xử lý',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS=1;
