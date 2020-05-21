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
 (1,0x61646D696E,0x737461726372616674406563656C6C23313233,0x61646D696E,0,0x31353839393635353935393630,0x3137463946353642363035344241313044454635353235373039423343383535),
 (2,0x7363646C,0x3838343437393636,0x61646D696E6973747261746F72,0,0x30,'');
/*!40000 ALTER TABLE `tb_admin` ENABLE KEYS */;


--
-- Definition of table `tb_match`
--

DROP TABLE IF EXISTS `tb_match`;
CREATE TABLE `tb_match` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `season_id` int(10) unsigned NOT NULL COMMENT '赛季ID',
  `schedule_id` int(10) unsigned NOT NULL COMMENT '赛程ID',
  `set_id` int(10) unsigned NOT NULL COMMENT '场次ID',
  `game_id` int(10) unsigned NOT NULL COMMENT '对局ID',
  `map_id` int(10) unsigned DEFAULT NULL COMMENT '地图ID',
  `race_day` varchar(45) COLLATE utf8_bin DEFAULT NULL COMMENT '比赛日期',
  `pa_id` int(10) unsigned DEFAULT NULL COMMENT 'A选手ID',
  `pb_id` int(10) unsigned DEFAULT NULL COMMENT 'B选手ID',
  `pa_race` varchar(45) COLLATE utf8_bin DEFAULT NULL COMMENT 'A选手种族',
  `pb_race` varchar(45) COLLATE utf8_bin DEFAULT NULL COMMENT 'B选手种族',
  `duration` varchar(45) COLLATE utf8_bin DEFAULT NULL COMMENT '比赛时长',
  `winner` int(10) unsigned DEFAULT NULL COMMENT '胜利方',
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
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `match_id` int(10) unsigned NOT NULL COMMENT '比赛ID',
  `player_id` int(10) unsigned NOT NULL COMMENT '选手ID',
  `duration` int(10) unsigned DEFAULT NULL COMMENT '比赛时长',
  `player_race` varchar(45) COLLATE utf8_bin DEFAULT NULL COMMENT '选手种族',
  `apm` int(10) unsigned DEFAULT NULL COMMENT '本场apm',
  `crystal` int(10) unsigned DEFAULT NULL COMMENT '水晶数',
  `oil` int(10) unsigned DEFAULT NULL COMMENT '油矿数',
  `resource` int(10) unsigned DEFAULT NULL COMMENT '资源数',
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
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `menu_id` int(10) unsigned NOT NULL COMMENT '菜单项ID',
  `parent_id` int(10) unsigned NOT NULL COMMENT '父菜单项ID',
  `name` varchar(45) NOT NULL COMMENT '菜单名称',
  `url` varchar(45) DEFAULT NULL COMMENT '访问URL',
  `type` int(10) unsigned NOT NULL COMMENT '菜单类型',
  `icon` varchar(45) DEFAULT NULL COMMENT '图标',
  `order_num` int(10) unsigned DEFAULT NULL COMMENT '顺序',
  `perms` varchar(256) DEFAULT NULL COMMENT '权限',
  `is_use` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '是否启用',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tb_menu`
--

/*!40000 ALTER TABLE `tb_menu` DISABLE KEYS */;
INSERT INTO `tb_menu` (`id`,`menu_id`,`parent_id`,`name`,`url`,`type`,`icon`,`order_num`,`perms`,`is_use`) VALUES 
 (1,1,0,'系统管理','',0,'fa fa-cog',0,'',0),
 (2,2,0,'赛季管理','',0,'fa fa-user-secret',0,'',1),
 (3,3,0,'选手管理','',0,'fa fa-user-secret',0,'',1),
 (4,4,0,'比赛管理','',0,'fa fa-user-secret',0,'',0),
 (5,100,1,'管理员信息','pages/system/admin.html',1,'',1,'',1),
 (6,200,2,'赛季信息','pages/season/season.html',1,'',1,'',1),
 (7,201,2,'赛程信息','pages/season/schedule.html',1,'',2,'',1),
 (8,300,3,'选手信息','pages/player/player.html',1,'',1,'',1),
 (9,400,4,'比赛信息','pages/match/match.html',1,'',1,'',1);
/*!40000 ALTER TABLE `tb_menu` ENABLE KEYS */;


--
-- Definition of table `tb_player`
--

DROP TABLE IF EXISTS `tb_player`;
CREATE TABLE `tb_player` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` varchar(45) COLLATE utf8_bin NOT NULL COMMENT '姓名',
  `gender` varchar(45) COLLATE utf8_bin DEFAULT NULL COMMENT '性别',
  `nick` varchar(45) COLLATE utf8_bin DEFAULT NULL COMMENT '昵称',
  `race` varchar(45) COLLATE utf8_bin NOT NULL COMMENT '种族',
  `country` varchar(45) COLLATE utf8_bin DEFAULT NULL COMMENT '国家',
  `birth` varchar(45) COLLATE utf8_bin DEFAULT NULL COMMENT '生日',
  `picture` varchar(45) COLLATE utf8_bin DEFAULT NULL COMMENT '头像',
  `team_name` varchar(45) COLLATE utf8_bin DEFAULT NULL COMMENT '战队',
  `qq` varchar(45) COLLATE utf8_bin DEFAULT NULL COMMENT 'QQ',
  `wechat` varchar(45) COLLATE utf8_bin DEFAULT NULL COMMENT '微信',
  `tel` varchar(45) COLLATE utf8_bin DEFAULT NULL COMMENT '电话',
  `status` int(10) unsigned NOT NULL COMMENT '状态',
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
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `player_id` int(11) NOT NULL COMMENT '选手ID',
  `all_apm` int(11) DEFAULT NULL COMMENT '总apm',
  `all_sets` int(11) DEFAULT NULL COMMENT '总对局次数',
  `all_resource` int(11) DEFAULT NULL COMMENT '总资源数',
  `all_crystal` int(11) DEFAULT NULL COMMENT '总水晶数',
  `all_oil` int(11) DEFAULT NULL COMMENT '总油矿数',
  `all_duration` int(11) DEFAULT NULL COMMENT '总时长',
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
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `player_id` int(10) unsigned NOT NULL COMMENT '选手ID',
  `tvtw` int(10) unsigned DEFAULT NULL COMMENT 'tvt胜场',
  `tvta` int(10) unsigned DEFAULT NULL COMMENT 'tvt总对局',
  `tvpw` int(10) unsigned DEFAULT NULL COMMENT 'tvp胜场',
  `tvpa` int(10) unsigned DEFAULT NULL COMMENT 'tvp总对局',
  `tvzw` int(10) unsigned DEFAULT NULL COMMENT 'tvz胜场',
  `tvza` int(10) unsigned DEFAULT NULL COMMENT 'tvz总对局',
  `pvtw` int(10) unsigned DEFAULT NULL COMMENT 'pvt胜场',
  `pvta` int(10) unsigned DEFAULT NULL COMMENT 'pvt总对局',
  `pvpw` int(10) unsigned DEFAULT NULL COMMENT 'pvp胜场',
  `pvpa` int(10) unsigned DEFAULT NULL COMMENT 'pvp总对局',
  `pvzw` int(10) unsigned DEFAULT NULL COMMENT 'pvz胜场',
  `pvza` int(10) unsigned DEFAULT NULL COMMENT 'pvz总对局',
  `zvtw` int(10) unsigned DEFAULT NULL COMMENT 'zvt胜场',
  `zvta` int(10) unsigned DEFAULT NULL COMMENT 'zvt总对局',
  `zvpw` int(10) unsigned DEFAULT NULL COMMENT 'zvp胜场',
  `zvpa` int(10) unsigned DEFAULT NULL COMMENT 'zvp总对局',
  `zvzw` int(10) unsigned DEFAULT NULL COMMENT 'zvz胜场',
  `zvza` int(10) unsigned DEFAULT NULL COMMENT 'zvz总对局',
  `country` int(10) unsigned DEFAULT NULL COMMENT '对手国籍',
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
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `season_id` int(10) unsigned NOT NULL COMMENT '赛季ID',
  `player_id` int(10) unsigned NOT NULL COMMENT '选手ID',
  `post_season_difference` int(10) unsigned DEFAULT NULL COMMENT '季后赛净胜',
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
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `season_id` int(10) unsigned NOT NULL COMMENT '赛季ID',
  `round` varchar(45) COLLATE utf8_bin NOT NULL COMMENT '场次',
  `sets` int(10) unsigned NOT NULL COMMENT '对局盘数',
  `format` int(10) unsigned NOT NULL COMMENT '赛制',
  `race_day` varchar(45) COLLATE utf8_bin DEFAULT '' COMMENT '比赛日期',
  `type` int(10) unsigned NOT NULL COMMENT '类型',
  `status` int(10) unsigned NOT NULL COMMENT '状态',
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
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` varchar(45) COLLATE utf8_bin NOT NULL COMMENT '赛季名称',
  `start_ts` varchar(45) COLLATE utf8_bin NOT NULL COMMENT '起始时间戳',
  `start_time` varchar(45) COLLATE utf8_bin NOT NULL COMMENT '起始时间',
  `status` int(10) unsigned NOT NULL COMMENT '状态',
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
