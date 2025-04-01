CREATE DATABASE `piante` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `piante`;

CREATE TABLE `images` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `file_name` varchar(255) NOT NULL,
  `plant_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`)
);


CREATE TABLE `plants` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `number` smallint(5) unsigned DEFAULT NULL,
  `location` point DEFAULT NULL,
  `circumference` smallint(5) unsigned DEFAULT NULL,
  `height` decimal(4,1) unsigned DEFAULT NULL,
  `common_name` varchar(180) DEFAULT NULL,
  `scientific_name` varchar(180) DEFAULT NULL,
  `insert_date` datetime NOT NULL DEFAULT current_timestamp(),
  `user_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`)
);


CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `token` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
);
