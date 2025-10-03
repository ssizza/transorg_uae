-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 03, 2025 at 02:21 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `Uae_transorg`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `fname` varchar(50) DEFAULT NULL,
  `sname` varchar(50) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `position` varchar(100) DEFAULT NULL,
  `last_login` timestamp NULL DEFAULT NULL,
  `role_id` int(11) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `status` enum('active','banned','pending','out of office','invited') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `username`, `email`, `password`, `fname`, `sname`, `dob`, `position`, `last_login`, `role_id`, `email_verified_at`, `status`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'admin@admin.com', '$2a$10$V7z.7UFuFoB6z/Xqg2dRhOi2MjsXJURK5nh5L/5QbDiS8ROK1DdrK', 'Rodhni', 'Kiggundu', NULL, NULL, '2025-10-03 12:16:48', 1, NULL, 'active', '2025-02-01 01:36:06', '2025-10-03 12:16:48');

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
(1, 'events.view', 'Can view events', '2025-01-31 20:09:40', '2025-01-31 20:09:40'),
(2, 'events.edit', 'Can edit events', '2025-01-31 20:09:40', '2025-01-31 20:09:40'),
(3, 'events.add', 'Can add new events', '2025-01-31 20:09:40', '2025-01-31 20:09:40'),
(4, 'events.delete', 'Can delete events', '2025-01-31 20:09:40', '2025-01-31 20:09:40'),
(5, 'blogs.view', 'Can view blog posts', '2025-01-31 20:09:40', '2025-01-31 20:09:40'),
(6, 'blogs.edit', 'Can edit blog posts', '2025-01-31 20:09:40', '2025-01-31 20:09:40'),
(7, 'blogs.add', 'Can add new blog posts', '2025-01-31 20:09:40', '2025-01-31 20:09:40'),
(8, 'blogs.delete', 'Can delete blog posts', '2025-01-31 20:09:40', '2025-01-31 20:09:40'),
(9, 'project_objectives.view', 'Can view project objectives', '2025-01-31 20:09:40', '2025-01-31 20:09:40'),
(10, 'project_objectives.edit', 'Can edit project objectives', '2025-01-31 20:09:40', '2025-01-31 20:09:40'),
(11, 'project_objectives.add', 'Can add new project objectives', '2025-01-31 20:09:40', '2025-01-31 20:09:40'),
(12, 'project_objectives.delete', 'Can delete project objectives', '2025-01-31 20:09:40', '2025-01-31 20:09:40'),
(13, 'projects.view', 'Can view projects', '2025-01-31 20:09:40', '2025-01-31 20:09:40'),
(14, 'projects.edit', 'Can edit projects', '2025-01-31 20:09:40', '2025-01-31 20:09:40'),
(15, 'projects.add', 'Can add new projects', '2025-01-31 20:09:40', '2025-01-31 20:09:40'),
(16, 'projects.delete', 'Can delete projects', '2025-01-31 20:09:40', '2025-01-31 20:09:40'),
(17, 'faq.view', 'Can view FAQs', '2025-01-31 20:09:40', '2025-01-31 20:09:40'),
(18, 'faq.edit', 'Can edit FAQs', '2025-01-31 20:09:40', '2025-01-31 20:09:40'),
(19, 'faq.add', 'Can add new FAQs', '2025-01-31 20:09:40', '2025-01-31 20:09:40'),
(20, 'faq.delete', 'Can delete FAQs', '2025-01-31 20:09:40', '2025-01-31 20:09:40'),
(21, 'update.admin', 'Can update admin  data like change role ', '2025-02-22 15:54:29', '2025-02-28 15:54:29'),
(22, 'admins.view', 'Can view admin users', '2025-10-03 10:53:32', '2025-10-03 10:53:32'),
(23, 'admins.add', 'Can add new admin users', '2025-10-03 10:53:32', '2025-10-03 10:53:32'),
(24, 'admins.edit', 'Can edit admin users', '2025-10-03 10:53:32', '2025-10-03 10:53:32'),
(25, 'admins.delete', 'Can delete admin users', '2025-10-03 10:53:32', '2025-10-03 10:53:32'),
(26, 'roles.view', 'Can view roles', '2025-10-03 10:53:32', '2025-10-03 10:53:32'),
(27, 'roles.edit', 'Can edit roles', '2025-10-03 10:53:32', '2025-10-03 10:53:32'),
(28, 'permissions.view', 'Can view permissions', '2025-10-03 10:53:32', '2025-10-03 10:53:32'),
(29, 'settings.view', 'Can view system settings', '2025-10-03 10:53:32', '2025-10-03 10:53:32'),
(30, 'settings.edit', 'Can edit system settings', '2025-10-03 10:53:32', '2025-10-03 10:53:32');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Super Admin', 'Full system access with all permissions', '2025-01-31 20:09:40', '2025-10-03 10:53:32'),
(2, 'Admin', 'Administrative access with most permissions', '2025-01-31 20:09:40', '2025-10-03 10:53:32'),
(3, 'Manager', 'Can manage content and view reports', '2025-01-31 20:09:40', '2025-10-03 10:53:32'),
(4, 'Editor', 'Can create and edit content', '2025-01-31 20:09:40', '2025-10-03 10:53:32'),
(5, 'Viewer', 'Read-only access to content', '2025-01-31 20:09:40', '2025-10-03 10:53:32');

-- --------------------------------------------------------

--
-- Table structure for table `roles_permissions`
--

CREATE TABLE `roles_permissions` (
  `id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles_permissions`
--

INSERT INTO `roles_permissions` (`id`, `role_id`, `permission_id`) VALUES
(12, 1, 1),
(11, 1, 2),
(9, 1, 3),
(10, 1, 4),
(8, 1, 5),
(7, 1, 6),
(5, 1, 7),
(6, 1, 8),
(25, 1, 9),
(24, 1, 10),
(22, 1, 11),
(23, 1, 12),
(21, 1, 13),
(20, 1, 14),
(18, 1, 15),
(19, 1, 16),
(16, 1, 17),
(15, 1, 18),
(13, 1, 19),
(14, 1, 20),
(30, 1, 21),
(4, 1, 22),
(1, 1, 23),
(3, 1, 24),
(2, 1, 25),
(27, 1, 26),
(26, 1, 27),
(17, 1, 28),
(29, 1, 29),
(28, 1, 30),
(43, 2, 1),
(42, 2, 2),
(40, 2, 3),
(41, 2, 4),
(39, 2, 5),
(38, 2, 6),
(36, 2, 7),
(37, 2, 8),
(55, 2, 9),
(54, 2, 10),
(52, 2, 11),
(53, 2, 12),
(51, 2, 13),
(50, 2, 14),
(48, 2, 15),
(49, 2, 16),
(47, 2, 17),
(46, 2, 18),
(44, 2, 19),
(45, 2, 20),
(59, 2, 21),
(35, 2, 22),
(32, 2, 23),
(34, 2, 24),
(33, 2, 25),
(56, 2, 26),
(58, 2, 29),
(57, 2, 30),
(70, 3, 1),
(69, 3, 2),
(68, 3, 3),
(67, 3, 5),
(66, 3, 6),
(65, 3, 7),
(80, 3, 9),
(79, 3, 10),
(78, 3, 11),
(77, 3, 13),
(76, 3, 14),
(75, 3, 15),
(73, 3, 17),
(72, 3, 18),
(71, 3, 19),
(64, 3, 22),
(63, 3, 24),
(82, 3, 26),
(81, 3, 27),
(74, 3, 28),
(84, 3, 29),
(83, 3, 30),
(99, 4, 1),
(98, 4, 2),
(97, 4, 3),
(96, 4, 5),
(95, 4, 6),
(94, 4, 7),
(109, 4, 9),
(108, 4, 10),
(107, 4, 11),
(106, 4, 13),
(105, 4, 14),
(104, 4, 15),
(102, 4, 17),
(101, 4, 18),
(100, 4, 19),
(111, 4, 26),
(110, 4, 27),
(103, 4, 28),
(126, 5, 1),
(125, 5, 5),
(130, 5, 9),
(129, 5, 13),
(127, 5, 17),
(131, 5, 26),
(128, 5, 28);

-- --------------------------------------------------------

--
-- Table structure for table `smtp_settings`
--

CREATE TABLE `smtp_settings` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `host` varchar(255) NOT NULL,
  `port` int(11) NOT NULL,
  `encryption` enum('SSL','TLS') NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `smtp_settings`
--

INSERT INTO `smtp_settings` (`id`, `name`, `host`, `port`, `encryption`, `username`, `password`) VALUES
(1, 'smtp', 'smtp.hostinger.com', 587, 'TLS', 'info@auucommunity.com', 'Auu@2024');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `role_id` (`role_id`),
  ADD KEY `idx_last_login` (`last_login`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `roles_permissions`
--
ALTER TABLE `roles_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `role_id` (`role_id`,`permission_id`),
  ADD KEY `permission_id` (`permission_id`);

--
-- Indexes for table `smtp_settings`
--
ALTER TABLE `smtp_settings`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `roles_permissions`
--
ALTER TABLE `roles_permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=132;

--
-- AUTO_INCREMENT for table `smtp_settings`
--
ALTER TABLE `smtp_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admins`
--
ALTER TABLE `admins`
  ADD CONSTRAINT `admins_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `roles_permissions`
--
ALTER TABLE `roles_permissions`
  ADD CONSTRAINT `roles_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `roles_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
