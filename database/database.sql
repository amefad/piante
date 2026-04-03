SET NAMES utf8;

CREATE DATABASE `piante` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `piante`;

CREATE TABLE `authorizations` (
  `role` enum('admin','editor','viewer','invalid') NOT NULL,
  `permission` varchar(20) NOT NULL,
  `self_only` tinyint NOT NULL,
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
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `file_name` varchar(255) NOT NULL,
  `plant_id` int unsigned NOT NULL,
  PRIMARY KEY (`id`)
);


CREATE TABLE `plants` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `location` point DEFAULT NULL,
  `number` smallint unsigned DEFAULT NULL,
  `diameters` json DEFAULT NULL,
  `height` decimal(4,1) unsigned DEFAULT NULL,
  `species_id` tinyint unsigned NOT NULL DEFAULT '1',
  `user_id` int unsigned NOT NULL,
  `insert_date` datetime NOT NULL DEFAULT current_timestamp(),
  `note` text DEFAULT NULL,
  PRIMARY KEY (`id`)
);


CREATE TABLE `species` (
  `id` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `scientific_name` varchar(100) NOT NULL,
  `common_name` varchar(200) DEFAULT NULL,
  `warning` tinytext,
  PRIMARY KEY (`id`)
);

INSERT INTO `species` (`scientific_name`, `common_name`, `warning`) VALUES
('Specie sconosciuta', 'Nome sconosciuto', 'Sarebbe meglio individuare la specie.'),
('Acer campestre', 'Acero campestre', NULL),
('Acer negundo', 'Acero americano / Acero negundo', NULL),
('Acer platanoides', 'Acero riccio', NULL),
('Acer platanoides \'Crimson King\'', 'Acero riccio Crimson King', NULL),
('Acer platanoides \'Globosum\'', 'Acero riccio Globosum', NULL),
('Acer pseudoplatanus', 'Acero di monte', NULL),
('Acer saccharinum', 'Acero argentato', NULL),
('Aesculus hippocastanum', 'Ippocastano', NULL),
('Betula alba', 'Betulla bianca', 'Betula alba è nome ambiguo: oggi si usa Betula pendula.'),
('Betula pendula', 'Betulla bianca / Betulla pendula', NULL),
('Calycanthus sp.', 'Calycanthus', NULL),
('Carpinus betulus', 'Carpino bianco', NULL),
('Carpinus betulus \'Pyramidalis\'', 'Carpino bianco colonnare', NULL),
('Catalpa bignonioides', 'Catalpa', NULL),
('Cedrus atlantica', 'Cedro dell\'Atlante', NULL),
('Cedrus atlantica \'Glauca\'', 'Cedro dell\'Atlante glauco', NULL),
('Cedrus deodara', 'Cedro dell\'Himalaya', NULL),
('Celtis australis', 'Bagolaro / Spaccasassi', NULL),
('Celtis occidentalis', 'Bagolaro americano', NULL),
('Chamaecyparis lawsoniana', 'Cipresso di Lawson', NULL),
('Cornus sanguinea', 'Sanguinello', NULL),
('Corylus avellana', 'Nocciolo', NULL),
('Crataegus monogyna', 'Biancospino', NULL),
('Crataegus sp.', 'Biancospino', NULL),
('Cupressus arizonica', 'Cipresso dell\'Arizona', NULL),
('Cupressus sempervirens', 'Cipresso comune / Cipresso toscano', NULL),
('Cupressus × leylandii', 'Leylandii / Cipresso di Leyland', NULL),
('Diospyros kaki', 'Cachi / Kaki', NULL),
('Eriobotrya japonica', 'Nespolo del Giappone', NULL),
('Fagus sylvatica', 'Faggio', NULL),
('Ficus carica', 'Fico', NULL),
('Fraxinus angustifolia', 'Frassino meridionale / Frassino ossifilo', NULL),
('Fraxinus excelsior', 'Frassino maggiore', NULL),
('Fraxinus ornus', 'Orniello', NULL),
('Fraxinus sp.', 'Frassino', NULL),
('Ginkgo biloba', 'Ginkgo / Albero dei ventagli', NULL),
('Ilex aquifolium', 'Agrifoglio', NULL),
('Juglans regia', 'Noce', NULL),
('Lagerstroemia sp.', 'Lagerstroemia / Mirto crespo', NULL),
('Laurus nobilis', 'Alloro / Lauro', NULL),
('Ligustrum lucidum', 'Ligustro lucido', NULL),
('Ligustrum sinense', 'Ligustro cinese', NULL),
('Ligustrum sp.', 'Ligustro', NULL),
('Ligustrum vulgare', 'Ligustro comune / Alaterno bastardo', NULL),
('Liquidambar styraciflua', 'Liquidambar americano', NULL),
('Liriodendron tulipifera', 'Albero dei tulipani / Liriodendro', NULL),
('Magnolia grandiflora', 'Magnolia sempreverde', NULL),
('Magnolia liliiflora', 'Magnolia lilla / Magnolia giapponese', NULL),
('Malus sylvestris', 'Melo selvatico', NULL),
('Morus alba', 'Gelso bianco', NULL),
('Morus sp.', 'Gelso', NULL),
('Nerium oleander', 'Oleandro', NULL),
('Olea europaea', 'Olivo', NULL),
('Osmanthus fragrans', 'Osmanto profumato / Osmanto fragrante', NULL),
('Ostrya carpinifolia', 'Carpino nero', NULL),
('Photinia sp.', 'Fotinia', NULL),
('Picea abies', 'Abete rosso', NULL),
('Pinus mugo', 'Pino mugo', NULL),
('Pinus nigra', 'Pino nero', NULL),
('Pinus pinea', 'Pino domestico', NULL),
('Pinus sylvestris', 'Pino silvestre', NULL),
('Pittosporum tobira', 'Pittosforo giapponese', NULL),
('Platanus acerifolia', 'Platano ibrido', NULL),
('Prunus armeniaca', 'Albicocco', NULL),
('Prunus avium', 'Ciliegio dolce', NULL),
('Prunus cerasifera \'Pissardii\'', 'Prunus Pissardii / Mirabolano rosso', NULL),
('Prunus domestica', 'Susino / Prugno domestico', NULL),
('Prunus laurocerasus', 'Lauroceraso', NULL),
('Prunus mahaleb', 'Ciliegio di Santa Lucia', NULL),
('Prunus sp.', 'Pruno', NULL),
('Prunus spinosa', 'Prugnolo / Pruno selvatico', NULL),
('Punica granatum', 'Melograno', NULL),
('Quercus ilex', 'Leccio', NULL),
('Quercus petraea', 'Rovere', NULL),
('Quercus robur', 'Farnia', NULL),
('Quercus robur \'Pyramidalis\'', 'Farnia colonnare', NULL),
('Quercus rubra', 'Quercia rossa', NULL),
('Robinia pseudoacacia', 'Robinia / Acacia', NULL),
('Salix alba', 'Salice bianco', NULL),
('Salix babylonica', 'Salice piangente', NULL),
('Taxus baccata', 'Tasso', NULL),
('Thuja occidentalis', 'Tuia occidentale', NULL),
('Thuja plicata', 'Tuia gigante / Tuia rossa', NULL),
('Tilia cordata', 'Tiglio selvatico / Tiglio a foglie piccole', NULL),
('Tilia platyphyllos', 'Tiglio nostrano / Tiglio a foglie grandi', NULL),
('Tilia sp.', 'Tiglio', NULL),
('Trachycarpus fortunei', 'Palma di Fortune / Palma cinese', NULL),
('Ulmus campestris', 'Olmo campestre', 'Ulmus campestris è nome storico: oggi si usa Ulmus minor.'),
('Ulmus minor', 'Olmo comune / Olmo campestre', NULL),
('Ulmus pumila', 'Olmo siberiano', NULL),
('Ulmus sp.', 'Olmo', NULL);


CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` enum('admin','editor','viewer','invalid') NOT NULL DEFAULT 'invalid',
  `password` varchar(255) NOT NULL,
  `token` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
);
