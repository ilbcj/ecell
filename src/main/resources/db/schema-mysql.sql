DROP TABLE IF EXISTS tb_admin;
CREATE TABLE `ecell`.`tb_admin` (
  `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `login_id` VARCHAR(30) NOT NULL COMMENT '账号',
  `pwd` VARCHAR(30) NOT NULL COMMENT '口令',
  `name` VARCHAR(30) NOT NULL COMMENT '姓名',
  `status` INTEGER UNSIGNED NOT NULL DEFAULT 0 COMMENT '状态',
  PRIMARY KEY (`id`)
)
ENGINE = InnoDB;

DROP TABLE IF EXISTS tb_season;
CREATE TABLE `ecell`.`tb_season` (
  `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` VARCHAR(45) NOT NULL COMMENT '赛季名称',
  `start_ts` VARCHAR(45) NOT NULL COMMENT '起始时间戳',
  `start_time` VARCHAR(45) NOT NULL COMMENT '起始时间',
  `status` INTEGER UNSIGNED NOT NULL COMMENT '状态',
  PRIMARY KEY (`id`)
)
ENGINE = InnoDB;

DROP TABLE IF EXISTS tb_schedule;
CREATE TABLE `ecell`.`tb_schedule` (
  `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `season_id` INTEGER UNSIGNED NOT NULL COMMENT '赛季ID',
  `round` VARCHAR(45) NOT NULL COMMENT '场次',
  `sets` INTEGER UNSIGNED NOT NULL COMMENT '对局盘数',
  `race_day` VARCHAR(45) NOT NULL COMMENT '比赛日期',
  `type` INTEGER UNSIGNED NOT NULL COMMENT '类型',
  `status` INTEGER UNSIGNED NOT NULL COMMENT '状态',
  PRIMARY KEY (`id`)
)
ENGINE = InnoDB;

DROP TABLE IF EXISTS tb_player;
CREATE TABLE `ecell`.`tb_player` (
  `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` VARCHAR(45) NOT NULL COMMENT '姓名',
  `gender` VARCHAR(45) COMMENT '性别',
  `nick` VARCHAR(45) COMMENT '昵称',
  `race` VARCHAR(45) NOT NULL COMMENT '种族',
  `country` VARCHAR(45) COMMENT '国家',
  `birth` VARCHAR(45) COMMENT '生日',
  `picture` VARCHAR(45) COMMENT '头像',
  `team_name` VARCHAR(45) COMMENT '战队',
  `qq` VARCHAR(45) COMMENT 'QQ',
  `wechat` VARCHAR(45) COMMENT '微信',
  `tel` VARCHAR(45) COMMENT '电话',
  `status` INTEGER UNSIGNED NOT NULL COMMENT '状态',
  PRIMARY KEY (`id`)
)
ENGINE = InnoDB;

DROP TABLE IF EXISTS tb_player_detail;
CREATE TABLE `ecell`.`tb_player_detail` (
  `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `player_id` INTEGER NOT NULL COMMENT '选手ID',
  `all_apm` INTEGER COMMENT '总apm',
  `all_sets` INTEGER COMMENT '总对局次数',
  `all_resource` INTEGER COMMENT '总资源数',
  `all_crystal` INTEGER COMMENT '总水晶数',
  `all_oil` INTEGER COMMENT '总油矿数',
  `all_duration` INTEGER COMMENT '总时长',
  PRIMARY KEY (`id`)
)
ENGINE = InnoDB;

DROP TABLE IF EXISTS tb_player_score_detail;
CREATE TABLE `ecell`.`tb_player_score_detail` (
  `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `player_id` INTEGER UNSIGNED NOT NULL COMMENT '选手ID',
  `tvtw` INTEGER UNSIGNED COMMENT 'tvt胜场',
  `tvta` INTEGER UNSIGNED COMMENT 'tvt总对局',
  `tvpw` INTEGER UNSIGNED COMMENT 'tvp胜场',
  `tvpa` INTEGER UNSIGNED COMMENT 'tvp总对局',
  `tvzw` INTEGER UNSIGNED COMMENT 'tvz胜场',
  `tvza` INTEGER UNSIGNED COMMENT 'tvz总对局',
  `pvtw` INTEGER UNSIGNED COMMENT 'pvt胜场',
  `pvta` INTEGER UNSIGNED COMMENT 'pvt总对局',
  `pvpw` INTEGER UNSIGNED COMMENT 'pvp胜场',
  `pvpa` INTEGER UNSIGNED COMMENT 'pvp总对局',
  `pvzw` INTEGER UNSIGNED COMMENT 'pvz胜场',
  `pvza` INTEGER UNSIGNED COMMENT 'pvz总对局',
  `zvtw` INTEGER UNSIGNED COMMENT 'zvt胜场',
  `zvta` INTEGER UNSIGNED COMMENT 'zvt总对局',
  `zvpw` INTEGER UNSIGNED COMMENT 'zvp胜场',
  `zvpa` INTEGER UNSIGNED COMMENT 'zvp总对局',
  `zvzw` INTEGER UNSIGNED COMMENT 'zvz胜场',
  `zvza` INTEGER UNSIGNED COMMENT 'zvz总对局',
  `country` INTEGER UNSIGNED COMMENT '对手国籍',
  PRIMARY KEY (`id`)
)
ENGINE = InnoDB;

DROP TABLE IF EXISTS tb_player_season_detail;
CREATE TABLE `ecell`.`tb_player_season_detail` (
  `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `season_id` INTEGER UNSIGNED NOT NULL COMMENT '赛季ID',
  `player_id` INTEGER UNSIGNED NOT NULL COMMENT '选手ID',
  `post_season_difference` INTEGER UNSIGNED COMMENT '季后赛净胜',
  PRIMARY KEY (`id`)
)
ENGINE = InnoDB;

DROP TABLE IF EXISTS tb_match;
CREATE TABLE `ecell`.`tb_match` (
  `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `season_id` INTEGER UNSIGNED NOT NULL COMMENT '赛季ID',
  `round_id` INTEGER UNSIGNED NOT NULL COMMENT '场次ID',
  `set` INTEGER UNSIGNED NOT NULL COMMENT '对局盘数',
  `pa_id` INTEGER UNSIGNED NOT NULL COMMENT 'A选手ID',
  `pb_id` INTEGER UNSIGNED NOT NULL COMMENT 'B选手ID',
  `pa_race` VARCHAR(45) NOT NULL COMMENT 'A选手种族',
  `pb_race` VARCHAR(45) NOT NULL COMMENT 'B选手种族',
  `winner` INTEGER UNSIGNED NOT NULL COMMENT '胜利方',
  PRIMARY KEY (`id`)
)
ENGINE = InnoDB;

DROP TABLE IF EXISTS tb_match_detail;
CREATE TABLE `ecell`.`tb_match_detail` (
  `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `match_id` INTEGER UNSIGNED NOT NULL COMMENT '比赛ID',
  `player_id` INTEGER UNSIGNED NOT NULL COMMENT '选手ID',
  `duration` INTEGER UNSIGNED COMMENT '比赛时长',
  `apm` INTEGER UNSIGNED COMMENT '本场apm',
  `crystal` INTEGER UNSIGNED COMMENT '水晶数',
  `oil` INTEGER UNSIGNED COMMENT '油矿数',
  `resource` INTEGER UNSIGNED COMMENT '资源数',
  PRIMARY KEY (`id`)
)
ENGINE = InnoDB;
