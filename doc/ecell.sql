-- MySQL Administrator dump 1.4
--
-- ------------------------------------------------------
-- Server version	5.6.24-log


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
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `login_id` varchar(30) NOT NULL COMMENT '账号',
  `pwd` varchar(30) NOT NULL COMMENT '口令',
  `name` varchar(30) NOT NULL COMMENT '姓名',
  `status` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '状态',
  `token` varchar(30) NOT NULL COMMENT 'token',
  `session_id` varchar(64) NOT NULL COMMENT 'sessionId',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tb_admin`
--

/*!40000 ALTER TABLE `tb_admin` DISABLE KEYS */;
INSERT INTO `tb_admin` (`id`,`login_id`,`pwd`,`name`,`status`,`token`,`session_id`) VALUES 
 (1,'admin','1','aa',0,'1589880649540','B70A08740CAC13445ACFD1F58AC2F660'),
 (2,'super','11111111','administrator',0,'','');
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
  `pa_id` int(10) unsigned DEFAULT NULL COMMENT 'A选手ID',
  `pb_id` int(10) unsigned DEFAULT NULL COMMENT 'B选手ID',
  `pa_race` varchar(45) DEFAULT NULL COMMENT 'A选手种族',
  `pb_race` varchar(45) DEFAULT NULL COMMENT 'B选手种族',
  `duration` varchar(45) DEFAULT NULL COMMENT '比赛时长',
  `winner` int(10) unsigned DEFAULT NULL COMMENT '胜利方',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tb_match`
--

/*!40000 ALTER TABLE `tb_match` DISABLE KEYS */;
INSERT INTO `tb_match` (`id`,`season_id`,`schedule_id`,`set_id`,`game_id`,`map_id`,`pa_id`,`pb_id`,`pa_race`,`pb_race`,`duration`,`winner`) VALUES 
 (61,8,1,1,1,2,2,1,'T','P','2673',2),
 (62,8,1,1,2,NULL,2,1,'T','P','0',2),
 (63,8,1,1,3,NULL,2,1,'T','P','0',1),
 (64,8,1,2,1,NULL,NULL,NULL,NULL,NULL,'0',0),
 (65,8,1,2,2,NULL,NULL,NULL,NULL,NULL,'0',0),
 (66,8,1,2,3,NULL,NULL,NULL,NULL,NULL,'0',0),
 (67,8,1,3,1,NULL,NULL,NULL,NULL,NULL,'0',0),
 (68,8,1,3,2,NULL,NULL,NULL,NULL,NULL,'0',0),
 (69,8,1,3,3,NULL,NULL,NULL,NULL,NULL,'0',0),
 (70,8,1,4,1,NULL,NULL,NULL,NULL,NULL,'0',0),
 (71,8,1,4,2,NULL,NULL,NULL,NULL,NULL,'0',0),
 (72,8,1,4,3,NULL,NULL,NULL,NULL,NULL,'0',0),
 (73,8,1,5,1,NULL,NULL,NULL,NULL,NULL,'0',0),
 (74,8,1,5,2,NULL,NULL,NULL,NULL,NULL,'0',0),
 (75,8,1,5,3,NULL,NULL,NULL,NULL,NULL,'0',0);
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
  `player_race` varchar(45) DEFAULT NULL COMMENT '选手种族',
  `apm` int(10) unsigned DEFAULT NULL COMMENT '本场apm',
  `crystal` int(10) unsigned DEFAULT NULL COMMENT '水晶数',
  `oil` int(10) unsigned DEFAULT NULL COMMENT '油矿数',
  `resource` int(10) unsigned DEFAULT NULL COMMENT '资源数',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tb_match_detail`
--

/*!40000 ALTER TABLE `tb_match_detail` DISABLE KEYS */;
INSERT INTO `tb_match_detail` (`id`,`match_id`,`player_id`,`duration`,`player_race`,`apm`,`crystal`,`oil`,`resource`) VALUES 
 (2,61,2,2673,'T',66,88,998,1086),
 (3,61,4,0,'P',0,0,0,0),
 (4,62,2,0,'T',0,0,0,0),
 (5,62,4,0,'P',0,0,0,0),
 (6,63,2,0,'T',0,0,0,0),
 (7,63,4,0,'P',0,0,0,0),
 (8,61,1,2673,'P',55,99,77,176),
 (9,62,1,0,'P',0,0,0,0),
 (10,63,1,0,'P',0,0,0,0);
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
  `name` varchar(45) NOT NULL COMMENT '姓名',
  `gender` varchar(45) DEFAULT NULL COMMENT '性别',
  `nick` varchar(45) DEFAULT NULL COMMENT '昵称',
  `race` varchar(45) NOT NULL COMMENT '种族',
  `country` varchar(45) DEFAULT NULL COMMENT '国家',
  `birth` varchar(45) DEFAULT NULL COMMENT '生日',
  `picture` varchar(45) DEFAULT NULL COMMENT '头像',
  `team_name` varchar(45) DEFAULT NULL COMMENT '战队',
  `qq` varchar(45) DEFAULT NULL COMMENT 'QQ',
  `wechat` varchar(45) DEFAULT NULL COMMENT '微信',
  `tel` varchar(45) DEFAULT NULL COMMENT '电话',
  `status` int(10) unsigned NOT NULL COMMENT '状态',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tb_player`
--

/*!40000 ALTER TABLE `tb_player` DISABLE KEYS */;
INSERT INTO `tb_player` (`id`,`name`,`gender`,`nick`,`race`,`country`,`birth`,`picture`,`team_name`,`qq`,`wechat`,`tel`,`status`) VALUES 
 (1,'super','1','中华','P','KR','2000-01-11','abc.jpg','For','510650','一线大场','13812345678',1),
 (2,'张三','1','欧盟','T','KR','2000-03-01','xxx.jpg','SVS','310650','二线大厂','13800000001',1),
 (3,'李四','0','亚太','T','KR','','xxx.jpg','','510650','二线大厂','',1),
 (4,'abcxx','0','地球','P','CN','2010-01-01','','sc.R)','31065011','二线大厂11','13812345678',1);
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
  `round` varchar(45) NOT NULL COMMENT '场次',
  `sets` int(10) unsigned NOT NULL COMMENT '对局盘数',
  `format` int(10) unsigned NOT NULL COMMENT '赛制',
  `race_day` varchar(45) DEFAULT '' COMMENT '比赛日期',
  `type` int(10) unsigned NOT NULL COMMENT '类型',
  `status` int(10) unsigned NOT NULL COMMENT '状态',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tb_schedule`
--

/*!40000 ALTER TABLE `tb_schedule` DISABLE KEYS */;
INSERT INTO `tb_schedule` (`id`,`season_id`,`round`,`sets`,`format`,`race_day`,`type`,`status`) VALUES 
 (1,8,'常规赛16进8_1',5,3,'',1,0),
 (2,8,'常规赛16进8_2',5,3,'',1,0),
 (3,8,'常规赛16进8_3',5,3,'',1,0),
 (4,8,'常规赛16进8_4',5,3,'',1,0),
 (5,8,'常规赛8进4_1',1,7,'',1,0),
 (6,8,'常规赛8进4_2',1,7,'',1,0),
 (7,8,'常规赛8进4_3',1,7,'',1,0),
 (8,8,'常规赛8进4_4',1,7,'',1,0),
 (9,8,'常规赛4进2_1',1,7,'',1,0),
 (10,8,'常规赛4进2_2',1,7,'',1,0),
 (11,8,'常规赛34名',1,9,'',1,0),
 (12,8,'常规赛12名',1,9,'',1,0),
 (13,8,'季后赛16进8_1',5,3,'',2,0),
 (14,8,'季后赛16进8_2',5,3,'',2,0),
 (15,8,'季后赛16进8_3',5,3,'',2,0),
 (16,8,'季后赛16进8_4',5,3,'',2,0),
 (17,8,'季后赛8进4_1',1,7,'',2,0),
 (18,8,'季后赛8进4_2',1,7,'',2,0),
 (19,8,'季后赛8进4_3',1,7,'',2,0),
 (20,8,'季后赛8进4_4',1,7,'',2,0),
 (21,8,'季后赛4进2_1',1,7,'',2,0),
 (22,8,'季后赛4进2_2',1,7,'',2,0),
 (23,8,'季后赛34名',1,9,'',2,0),
 (24,8,'季后赛12名',1,9,'',2,0);
/*!40000 ALTER TABLE `tb_schedule` ENABLE KEYS */;


--
-- Definition of table `tb_season`
--

DROP TABLE IF EXISTS `tb_season`;
CREATE TABLE `tb_season` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` varchar(45) NOT NULL COMMENT '赛季名称',
  `start_ts` varchar(45) NOT NULL COMMENT '起始时间戳',
  `start_time` varchar(45) NOT NULL COMMENT '起始时间',
  `status` int(10) unsigned NOT NULL COMMENT '状态',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tb_season`
--

/*!40000 ALTER TABLE `tb_season` DISABLE KEYS */;
INSERT INTO `tb_season` (`id`,`name`,`start_ts`,`start_time`,`status`) VALUES 
 (1,'第一季','11111111111111','2020-05-01',1),
 (2,'第二季','1589731200000','2020-05-18',0),
 (3,'第三季','1590854400000','2020-05-31',0),
 (4,'4444','1589731200000','2020-05-18',0),
 (5,'555','1589731200000','2020-05-18',0),
 (7,'666','1589731200000','2020-05-18',0),
 (8,'创世纪','1589731200000','2020-05-18',1);
/*!40000 ALTER TABLE `tb_season` ENABLE KEYS */;




/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
