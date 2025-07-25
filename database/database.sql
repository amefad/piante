CREATE DATABASE `piante` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `piante`;

CREATE TABLE `authorizations` (
  `role` enum('admin','editor','viewer','invalid') NOT NULL,
  `permission` varchar(20) NOT NULL,
  `self_only` tinyint(1) NOT NULL,
  UNIQUE KEY `authorization` (`role`,`permission`)
);

INSERT INTO `authorizations` (`role`, `permission`, `self_only`) VALUES
('admin',	'create_image',	0),
('admin',	'create_plant',	0),
('admin',	'create_user',	0),
('admin',	'delete_image',	0),
('admin',	'delete_plant',	0),
('admin',	'delete_user',	0),
('admin',	'edit_plant',	0),
('admin',	'edit_user',	0),
('admin',	'view_user',	0),
('admin',	'view_users',	0),
('editor',	'create_image',	0),
('editor',	'create_plant',	0),
('editor',	'delete_image',	0),
('editor',	'delete_plant',	0),
('editor',	'delete_user',	1),
('editor',	'edit_plant',	0),
('editor',	'edit_user',	1),
('editor',	'view_user',	1),
('viewer',	'delete_user',	1),
('viewer',	'edit_user',	1),
('viewer',	'view_user',	1),
('invalid',	'create_user',	1),
('invalid',	'edit_user',	1);


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
  `circumferences` json DEFAULT NULL,
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
  `role` enum('admin','editor','viewer','invalid') NOT NULL DEFAULT 'invalid',
  `password` varchar(255) NOT NULL,
  `token` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
);
