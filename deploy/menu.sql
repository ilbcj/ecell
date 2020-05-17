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




/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
