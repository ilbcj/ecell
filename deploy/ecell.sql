-- MySQL Administrator dump 1.4
--
-- ------------------------------------------------------
-- Server version	5.7.30


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


--
-- Create schema ecell
--

CREATE DATABASE IF NOT EXISTS ecell;
USE ecell;

--
-- Definition of table `tb_admin`
--

DROP TABLE IF EXISTS `tb_admin`;
CREATE TABLE `tb_admin` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `login_id` varchar(30) COLLATE utf8_bin NOT NULL,
  `pwd` varchar(30) COLLATE utf8_bin NOT NULL,
  `name` varchar(30) COLLATE utf8_bin NOT NULL,
  `status` int(10) unsigned NOT NULL DEFAULT '0',
  `token` varchar(30) COLLATE utf8_bin NOT NULL DEFAULT '' COMMENT 'token',
  `session_id` varchar(64) COLLATE utf8_bin NOT NULL DEFAULT '' COMMENT 'sessionId',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `tb_admin`
--

/*!40000 ALTER TABLE `tb_admin` DISABLE KEYS */;
INSERT INTO `tb_admin` (`id`,`login_id`,`pwd`,`name`,`status`,`token`,`session_id`) VALUES 
 (1,0x61646D696E,0x313233343536,0x61646D696E,0,'',''),
 (2,0x7375706572,0x3131313131313131,0x61646D696E6973747261746F72,0,'','');
/*!40000 ALTER TABLE `tb_admin` ENABLE KEYS */;


--
-- Definition of table `tb_match`
--

DROP TABLE IF EXISTS `tb_match`;
CREATE TABLE `tb_match` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `season_id` int(10) unsigned NOT NULL COMMENT 'ID',
  `schedule_id` int(10) unsigned NOT NULL COMMENT 'ID',
  `set_id` int(10) unsigned NOT NULL COMMENT 'ID',
  `map_id` int(10) unsigned DEFAULT NULL COMMENT 'ID',
  `pa_id` int(10) unsigned DEFAULT NULL COMMENT 'AID',
  `pb_id` int(10) unsigned DEFAULT NULL COMMENT 'BID',
  `pa_race` varchar(45) COLLATE utf8_bin DEFAULT NULL COMMENT 'A',
  `pb_race` varchar(45) COLLATE utf8_bin DEFAULT NULL COMMENT 'B',
  `duration` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `winner` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `tb_match`
--

/*!40000 ALTER TABLE `tb_match` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_match` ENABLE KEYS */;


--
-- Definition of table `tb_match_detail`
--

DROP TABLE IF EXISTS `tb_match_detail`;
CREATE TABLE `tb_match_detail` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `match_id` int(10) unsigned NOT NULL COMMENT 'ID',
  `player_id` int(10) unsigned NOT NULL COMMENT 'ID',
  `duration` int(10) unsigned DEFAULT NULL,
  `apm` int(10) unsigned DEFAULT NULL COMMENT 'apm',
  `crystal` int(10) unsigned DEFAULT NULL,
  `oil` int(10) unsigned DEFAULT NULL,
  `resource` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `tb_match_detail`
--

/*!40000 ALTER TABLE `tb_match_detail` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_match_detail` ENABLE KEYS */;


--
-- Definition of table `tb_menu`
--

DROP TABLE IF EXISTS `tb_menu`;
CREATE TABLE `tb_menu` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `menu_id` int(10) unsigned NOT NULL COMMENT 'ID',
  `parent_id` int(10) unsigned NOT NULL COMMENT 'ID',
  `name` varchar(45) COLLATE utf8_bin NOT NULL,
  `url` varchar(45) COLLATE utf8_bin DEFAULT NULL COMMENT 'URL',
  `type` int(10) unsigned NOT NULL,
  `icon` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `order_num` int(10) unsigned DEFAULT NULL,
  `perms` varchar(256) COLLATE utf8_bin DEFAULT NULL,
  `is_use` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `tb_menu`
--

/*!40000 ALTER TABLE `tb_menu` DISABLE KEYS */;
INSERT INTO `tb_menu` (`id`,`menu_id`,`parent_id`,`name`,`url`,`type`,`icon`,`order_num`,`perms`,`is_use`) VALUES 
 (1,1,0,'','',0,0x66612066612D636F67,0,'',0),
 (2,2,0,'','',0,0x66612066612D757365722D736563726574,0,'',1),
 (3,3,0,'','',0,0x66612066612D757365722D736563726574,0,'',1),
 (4,4,0,'','',0,0x66612066612D757365722D736563726574,0,'',0),
 (5,100,1,'',0x70616765732F73797374656D2F61646D696E2E68746D6C,1,'',1,'',1),
 (6,200,2,'',0x70616765732F736561736F6E2F736561736F6E2E68746D6C,1,'',1,'',1),
 (7,201,2,'',0x70616765732F736561736F6E2F7363686564756C652E68746D6C,1,'',2,'',1),
 (8,300,3,'',0x70616765732F706C617965722F706C617965722E68746D6C,1,'',1,'',1),
 (9,400,4,'',0x70616765732F6D617463682F6D617463682E68746D6C,1,'',1,'',1);
/*!40000 ALTER TABLE `tb_menu` ENABLE KEYS */;


--
-- Definition of table `tb_player`
--

DROP TABLE IF EXISTS `tb_player`;
CREATE TABLE `tb_player` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `name` varchar(45) COLLATE utf8_bin NOT NULL,
  `gender` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `nick` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `race` varchar(45) COLLATE utf8_bin NOT NULL,
  `country` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `birth` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `picture` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `team_name` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `qq` varchar(45) COLLATE utf8_bin DEFAULT NULL COMMENT 'QQ',
  `wechat` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `tel` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `status` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `tb_player`
--

/*!40000 ALTER TABLE `tb_player` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_player` ENABLE KEYS */;


--
-- Definition of table `tb_player_detail`
--

DROP TABLE IF EXISTS `tb_player_detail`;
CREATE TABLE `tb_player_detail` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `player_id` int(11) NOT NULL COMMENT 'ID',
  `all_apm` int(11) DEFAULT NULL COMMENT 'apm',
  `all_sets` int(11) DEFAULT NULL,
  `all_resource` int(11) DEFAULT NULL,
  `all_crystal` int(11) DEFAULT NULL,
  `all_oil` int(11) DEFAULT NULL,
  `all_duration` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `tb_player_detail`
--

/*!40000 ALTER TABLE `tb_player_detail` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_player_detail` ENABLE KEYS */;


--
-- Definition of table `tb_player_score_detail`
--

DROP TABLE IF EXISTS `tb_player_score_detail`;
CREATE TABLE `tb_player_score_detail` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `player_id` int(10) unsigned NOT NULL COMMENT 'ID',
  `tvtw` int(10) unsigned DEFAULT NULL COMMENT 'tvt',
  `tvta` int(10) unsigned DEFAULT NULL COMMENT 'tvt',
  `tvpw` int(10) unsigned DEFAULT NULL COMMENT 'tvp',
  `tvpa` int(10) unsigned DEFAULT NULL COMMENT 'tvp',
  `tvzw` int(10) unsigned DEFAULT NULL COMMENT 'tvz',
  `tvza` int(10) unsigned DEFAULT NULL COMMENT 'tvz',
  `pvtw` int(10) unsigned DEFAULT NULL COMMENT 'pvt',
  `pvta` int(10) unsigned DEFAULT NULL COMMENT 'pvt',
  `pvpw` int(10) unsigned DEFAULT NULL COMMENT 'pvp',
  `pvpa` int(10) unsigned DEFAULT NULL COMMENT 'pvp',
  `pvzw` int(10) unsigned DEFAULT NULL COMMENT 'pvz',
  `pvza` int(10) unsigned DEFAULT NULL COMMENT 'pvz',
  `zvtw` int(10) unsigned DEFAULT NULL COMMENT 'zvt',
  `zvta` int(10) unsigned DEFAULT NULL COMMENT 'zvt',
  `zvpw` int(10) unsigned DEFAULT NULL COMMENT 'zvp',
  `zvpa` int(10) unsigned DEFAULT NULL COMMENT 'zvp',
  `zvzw` int(10) unsigned DEFAULT NULL COMMENT 'zvz',
  `zvza` int(10) unsigned DEFAULT NULL COMMENT 'zvz',
  `country` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `tb_player_score_detail`
--

/*!40000 ALTER TABLE `tb_player_score_detail` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_player_score_detail` ENABLE KEYS */;


--
-- Definition of table `tb_player_season_detail`
--

DROP TABLE IF EXISTS `tb_player_season_detail`;
CREATE TABLE `tb_player_season_detail` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `season_id` int(10) unsigned NOT NULL COMMENT 'ID',
  `player_id` int(10) unsigned NOT NULL COMMENT 'ID',
  `post_season_difference` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `tb_player_season_detail`
--

/*!40000 ALTER TABLE `tb_player_season_detail` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_player_season_detail` ENABLE KEYS */;


--
-- Definition of table `tb_schedule`
--

DROP TABLE IF EXISTS `tb_schedule`;
CREATE TABLE `tb_schedule` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `season_id` int(10) unsigned NOT NULL COMMENT 'ID',
  `round` varchar(45) COLLATE utf8_bin NOT NULL,
  `sets` int(10) unsigned NOT NULL,
  `format` int(10) unsigned NOT NULL,
  `race_day` varchar(45) COLLATE utf8_bin DEFAULT '',
  `type` int(10) unsigned NOT NULL,
  `status` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `tb_schedule`
--

/*!40000 ALTER TABLE `tb_schedule` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_schedule` ENABLE KEYS */;


--
-- Definition of table `tb_season`
--

DROP TABLE IF EXISTS `tb_season`;
CREATE TABLE `tb_season` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `name` varchar(45) COLLATE utf8_bin NOT NULL,
  `start_ts` varchar(45) COLLATE utf8_bin NOT NULL,
  `start_time` varchar(45) COLLATE utf8_bin NOT NULL,
  `status` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `tb_season`
--

/*!40000 ALTER TABLE `tb_season` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_season` ENABLE KEYS */;




/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
