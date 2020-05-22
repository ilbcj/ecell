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
 (1,0x61646D696E,0x737461726372616674406563656C6C23313233,0x61646D696E,0,0x31353930313237323131343134,0x3430343943463830464242464334453143333345413831364435443846423233),
 (2,0x7363646C,0x3838343437393636,0x61646D696E6973747261746F72,0,0x31353930303933353538313535,0x4132363542353342343843463842393630353134453643413531463330313933);
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
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `tb_match`
--

/*!40000 ALTER TABLE `tb_match` DISABLE KEYS */;
INSERT INTO `tb_match` (`id`,`season_id`,`schedule_id`,`set_id`,`game_id`,`map_id`,`race_day`,`pa_id`,`pb_id`,`pa_race`,`pb_race`,`duration`,`winner`) VALUES 
 (1,1,1,1,1,5,0x323032302D30352D3231,1,2,0x5A,0x50,0x353139,1),
 (2,1,1,1,2,1,0x323032302D30352D3231,1,2,0x5A,0x50,0x373432,1),
 (3,1,1,1,3,NULL,0x323032302D30352D3231,1,2,0x5A,0x50,0x30,0),
 (4,1,1,2,1,5,0x323032302D30352D3231,4,3,0x50,0x5A,0x31323031,1),
 (5,1,1,2,2,1,0x323032302D30352D3231,4,3,0x50,0x5A,0x333938,2),
 (6,1,1,2,3,6,0x323032302D30352D3231,4,3,0x50,0x5A,0x363735,2),
 (7,1,1,3,1,9,0x323032302D30352D3231,1,3,0x5A,0x5A,0x343639,2),
 (8,1,1,3,2,3,0x323032302D30352D3231,1,3,0x5A,0x5A,0x353036,2),
 (9,1,1,3,3,NULL,0x323032302D30352D3231,1,3,0x5A,0x5A,0x30,0),
 (10,1,1,4,1,9,0x323032302D30352D3231,2,4,0x50,0x50,0x343830,1),
 (11,1,1,4,2,3,0x323032302D30352D3231,2,4,0x50,0x50,0x343831,2),
 (12,1,1,4,3,7,0x323032302D30352D3231,2,4,0x50,0x50,0x363735,2),
 (13,1,1,5,1,8,0x323032302D30352D3231,1,4,0x5A,0x50,0x393431,2),
 (14,1,1,5,2,4,0x323032302D30352D3231,1,4,0x5A,0x50,0x31323538,2),
 (15,1,1,5,3,NULL,0x323032302D30352D3231,1,4,0x5A,0x50,0x30,0);
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
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `tb_match_detail`
--

/*!40000 ALTER TABLE `tb_match_detail` DISABLE KEYS */;
INSERT INTO `tb_match_detail` (`id`,`match_id`,`player_id`,`duration`,`player_race`,`apm`,`crystal`,`oil`,`resource`) VALUES 
 (1,1,1,519,0x5A,342,7866,1536,9402),
 (2,1,2,519,0x50,346,6594,720,7314),
 (3,2,1,742,0x5A,351,11386,3128,14514),
 (4,2,2,742,0x50,363,10546,1656,12202),
 (5,3,1,0,0x5A,0,0,0,0),
 (6,3,2,0,0x50,0,0,0,0),
 (7,4,4,1201,0x50,334,31954,12064,44018),
 (8,4,3,1201,0x5A,254,28078,11418,39496),
 (9,5,4,398,0x50,406,5258,1016,6274),
 (10,5,3,398,0x5A,260,5306,1088,6394),
 (11,6,4,675,0x50,355,12642,3080,15722),
 (12,6,3,675,0x5A,290,11394,2016,13410),
 (13,7,1,469,0x5A,344,3666,1328,4994),
 (14,7,3,469,0x5A,275,4074,1832,5906),
 (15,8,1,506,0x5A,372,3850,1824,5674),
 (16,8,3,506,0x5A,268,3570,2344,5914),
 (17,9,1,0,0x5A,0,0,0,0),
 (18,9,3,0,0x5A,0,0,0,0),
 (19,10,2,480,0x50,292,7450,1584,9034),
 (20,10,4,480,0x50,371,5586,1648,7234),
 (21,11,2,481,0x50,347,5866,1688,7554),
 (22,11,4,481,0x50,397,6578,1800,8378),
 (23,12,2,675,0x50,336,9154,1232,10386),
 (24,12,4,675,0x50,359,12642,2720,15362),
 (25,13,1,941,0x5A,325,18794,5776,24570),
 (26,13,4,941,0x50,352,21538,6376,27914),
 (27,14,1,1258,0x5A,332,33398,11402,44800),
 (28,14,4,1258,0x50,329,29882,9472,39354),
 (29,15,1,0,0x5A,0,0,0,0),
 (30,15,4,0,0x50,0,0,0,0);
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `tb_player`
--

/*!40000 ALTER TABLE `tb_player` DISABLE KEYS */;
INSERT INTO `tb_player` (`id`,`name`,`gender`,`nick`,`race`,`country`,`birth`,`picture`,`team_name`,`qq`,`wechat`,`tel`,`status`) VALUES 
 (1,0xE99986E7BF94,0x31,0xE78BACE5ADA4E6B182E8B4A5,0x5A,0x434E,'','','','','','',1),
 (2,'',0x31,0x505050505050,0x50,0x434E,'','','','','','',1),
 (3,0xE7ABA0E698A5E99BB7,0x31,0x5B5376535D2E46656E677A69,0x5A,0x434E,'','',0x5B5376535D,'','','',1),
 (4,0xE5BA9EE4BC9FE69FB1,0x31,0x5A68616E68756E,0x50,0x434E,'','',0x5B5376535D,'','','',1);
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
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `tb_schedule`
--

/*!40000 ALTER TABLE `tb_schedule` DISABLE KEYS */;
INSERT INTO `tb_schedule` (`id`,`season_id`,`round`,`sets`,`format`,`race_day`,`type`,`status`) VALUES 
 (1,1,0xE5B8B8E8A784E8B59B3136E8BF9B385F31,5,3,'',1,0),
 (2,1,0xE5B8B8E8A784E8B59B3136E8BF9B385F32,5,3,'',1,0),
 (3,1,0xE5B8B8E8A784E8B59B3136E8BF9B385F33,5,3,'',1,0),
 (4,1,0xE5B8B8E8A784E8B59B3136E8BF9B385F34,5,3,'',1,0),
 (5,1,0xE5B8B8E8A784E8B59B38E8BF9B345F31,1,7,'',1,0),
 (6,1,0xE5B8B8E8A784E8B59B38E8BF9B345F32,1,7,'',1,0),
 (7,1,0xE5B8B8E8A784E8B59B38E8BF9B345F33,1,7,'',1,0),
 (8,1,0xE5B8B8E8A784E8B59B38E8BF9B345F34,1,7,'',1,0),
 (9,1,0xE5B8B8E8A784E8B59B34E8BF9B325F31,1,7,'',1,0),
 (10,1,0xE5B8B8E8A784E8B59B34E8BF9B325F32,1,7,'',1,0),
 (11,1,0xE5B8B8E8A784E8B59B3334E5908D,1,9,'',1,0),
 (12,1,0xE5B8B8E8A784E8B59B3132E5908D,1,9,'',1,0),
 (13,1,0xE5ADA3E5908EE8B59B3136E8BF9B385F31,5,3,'',2,0),
 (14,1,0xE5ADA3E5908EE8B59B3136E8BF9B385F32,5,3,'',2,0),
 (15,1,0xE5ADA3E5908EE8B59B3136E8BF9B385F33,5,3,'',2,0),
 (16,1,0xE5ADA3E5908EE8B59B3136E8BF9B385F34,5,3,'',2,0),
 (17,1,0xE5ADA3E5908EE8B59B38E8BF9B345F31,1,7,'',2,0),
 (18,1,0xE5ADA3E5908EE8B59B38E8BF9B345F32,1,7,'',2,0),
 (19,1,0xE5ADA3E5908EE8B59B38E8BF9B345F33,1,7,'',2,0),
 (20,1,0xE5ADA3E5908EE8B59B38E8BF9B345F34,1,7,'',2,0),
 (21,1,0xE5ADA3E5908EE8B59B34E8BF9B325F31,1,7,'',2,0),
 (22,1,0xE5ADA3E5908EE8B59B34E8BF9B325F32,1,7,'',2,0),
 (23,1,0xE5ADA3E5908EE8B59B3334E5908D,1,9,'',2,0),
 (24,1,0xE5ADA3E5908EE8B59B3132E5908D,1,9,'',2,0);
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `tb_season`
--

/*!40000 ALTER TABLE `tb_season` DISABLE KEYS */;
INSERT INTO `tb_season` (`id`,`name`,`start_ts`,`start_time`,`status`) VALUES 
 (1,0x43656C6C47616D65E8B685E7BAA7E88194E8B59B3230E5B9B4E7ACACE4B880E8B59BE5ADA3,0x31353839373331323030303030,0x323032302D30352D3138,1);
/*!40000 ALTER TABLE `tb_season` ENABLE KEYS */;




/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
