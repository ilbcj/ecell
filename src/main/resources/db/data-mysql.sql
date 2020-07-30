DELETE FROM tb_admin;

INSERT INTO tb_admin (id, login_id, name, pwd) VALUES
(1, 'admin', '管理员', '123456'),
(2, 'super', 'administrator', '11111111');


DELETE FROM tb_menu;
INSERT INTO tb_menu (menu_id, parent_id, name, url, type, icon, order_num, perms, is_use) VALUES
(1, 0, '系统管理', '', 0, 'fa fa-cog', 0, '', 0),
(2, 0, '赛季管理', '', 0, 'fa fa-user-secret', 0, '', 1),
(3, 0, '选手管理', '', 0, 'fa fa-user-secret', 0, '', 1),
(4, 0, '比赛管理', '', 0, 'fa fa-user-secret', 0, '', 0),
(100, 1, '管理员信息', 'pages/system/admin.html', 1, '', 1, '', 1),
(200, 2, '赛季信息', 'pages/season/season.html', 1, '', 1, '', 1),
(201, 2, '赛程信息', 'pages/season/schedule.html', 1, '', 2, '', 1),
(300, 3, '选手信息', 'pages/player/player.html', 1, '', 1, '', 1),
(400, 4, '比赛信息', 'pages/match/match.html', 1, '', 1, '', 1);

DELETE FROM tb_ditu;
INSERT INTO tb_ditu (id, name) VALUES
(1, '小仙女'),
(2, '云梯'),
(3, '血岭'),
(4, '角斗士'),
(5, '守望先锋'),
(6, '斗魂'),
(7, '断路器'),
(8, '赛点'),
(9, '拉曼查');
(10, '日蚀');
(11, '水螅');
(12, '收获风暴');