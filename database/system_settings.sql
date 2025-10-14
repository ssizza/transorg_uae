-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Oct 03, 2025 at 06:22 AM
-- Server version: 11.8.3-MariaDB-log
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `u829000194_trans_Auu`
--

-- --------------------------------------------------------

--
-- Table structure for table `system_settings`
--

CREATE TABLE `system_settings` (
  `id` int(11) NOT NULL,
  `site_name` varchar(100) NOT NULL,
  `cur_name` varchar(50) NOT NULL,
  `cur_symb` varchar(10) NOT NULL,
  `email_from` varchar(100) NOT NULL,
  `email_from_name` varchar(100) NOT NULL,
  `base_color` varchar(7) NOT NULL,
  `secondary_color` varchar(7) NOT NULL,
  `mail_config` text DEFAULT NULL,
  `global_shortcodes` text DEFAULT NULL,
  `multi_lang` tinyint(1) DEFAULT 0,
  `force_ssl` tinyint(1) DEFAULT 0,
  `maintenance_mode` tinyint(1) DEFAULT 0,
  `secure_pass` varchar(255) DEFAULT NULL,
  `agree` tinyint(1) DEFAULT 0,
  `registration` tinyint(1) DEFAULT 1,
  `active_template` varchar(50) DEFAULT NULL,
  `socialite_credentials` text DEFAULT NULL,
  `systema_customized` tinyint(1) DEFAULT 0,
  `currency_format` enum('1','2','3') DEFAULT '1',
  `last_cron` timestamp NULL DEFAULT NULL,
  `available_version` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `logo_data` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `system_settings`
--

INSERT INTO `system_settings` (`id`, `site_name`, `cur_name`, `cur_symb`, `email_from`, `email_from_name`, `base_color`, `secondary_color`, `mail_config`, `global_shortcodes`, `multi_lang`, `force_ssl`, `maintenance_mode`, `secure_pass`, `agree`, `registration`, `active_template`, `socialite_credentials`, `systema_customized`, `currency_format`, `last_cron`, `available_version`, `created_at`, `updated_at`, `logo_data`) VALUES
(1, 'Association Of Ugandan\'s In UAE', 'USD', '$', 'info@auucommunity.com', 'Auu Community', 'green', 'blue', NULL, NULL, 0, 0, 0, NULL, 1, 1, 'default', NULL, 0, '1', NULL, '1.0.0', '2025-07-11 13:53:44', '2025-07-11 16:16:54', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `system_settings`
--
ALTER TABLE `system_settings`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `system_settings`
--
ALTER TABLE `system_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
