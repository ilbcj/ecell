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