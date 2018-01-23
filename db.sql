CREATE DATABASE `frontdb` DEFAULT CHARACTER
SET utf8
COLLATE utf8_general_ci;


-- show full columns from tablename;


DROP TABLE IF EXISTS `app`;
CREATE TABLE IF NOT EXISTS `app`(
   `app_id` INT AUTO_INCREMENT,
   `account_id` INT,
   `app_name` VARCHAR(20) NOT NULL,
   `description` VARCHAR(100) DEFAULT '',
   `token` VARCHAR(32) DEFAULT '',
   `domain` VARCHAR(32) NOT NULL,
   `add_time` DATETIME,
   `last_time` DATETIME,
   PRIMARY KEY ( `app_id` ),
   CONSTRAINT `FKapp_account_appid_account_id` FOREIGN KEY(`account_id`) REFERENCES `account`(`account_id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `request`;
CREATE TABLE IF NOT EXISTS `request`(
  `request_id` INT AUTO_INCREMENT,
  `app_id` INT NOT NULL,
  `current_url` VARCHAR(100) NOT NULL comment '当前url',
  `referer_url` VARCHAR(100) DEFAULT '' comment '来源url',
  `client_id` VARCHAR(32) NOT NULL comment '客户端用户标识,放localstorage',
  `request_url` VARCHAR(100) NOT NULL comment 'ajax 请求url',
  `request_data` VARCHAR(500) DEFAULT '' comment '请求参数',
  `response_status` CHAR(3) NOT NULL DEFAULT '200' comment 'ajax返回状态',
  `timing` SMALLINT NOT NULL DEFAULT 0 comment 'ajax请求时间',
  `useragent` VARCHAR(200) DEFAULT '',
  `add_time` DATETIME,
  PRIMARY KEY(`request_id`),
  CONSTRAINT `FKrequest_app_app_id` FOREIGN KEY(`app_id`) REFERENCES `app`(`app_id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `errors`;
CREATE TABLE IF NOT EXISTS `errors`(
`error_id` INT AUTO_INCREMENT,
`app_id` INT NOT NULL,
`current_url` VARCHAR(100) NOT NULL comment '当前url',
`client_id` VARCHAR(32) NOT NULL comment '客户端用户标识,放localstorage',
`useragent` VARCHAR(200) DEFAULT '',
`message` VARCHAR(200) DEFAULT '',
`source` VARCHAR(200) DEFAULT '',
`line` CHAR(10) DEFAULT 0,
`add_time` DATETIME,
PRIMARY KEY(`error_id`),
CONSTRAINT `FKerror_app_app_id` FOREIGN KEY(`app_id`) REFERENCES `app`(`app_id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `account`;
CREATE TABLE IF NOT EXISTS `account`(
`account_id` INT AUTO_INCREMENT,
`username` VARCHAR(20) NOT NULL,
`password` VARCHAR(32) NOT NULL,
`email` VARCHAR(50) DEFAULT '',
`phone` CHAR(11) DEFAULT '',
`company` VARCHAR(50) DEFAULT '',
`job` VARCHAR(20) DEFAULT '',
`add_time` DATETIME,
`last_time` DATETIME,
PRIMARY KEY (`account_id`)
)ENGINE = InnoDB DEFAULT CHARSET=utf8;

INSERT INTO ACCOUNT VALUES(0,'zhxh','202cb962ac59075b964b07152d234b70','','','','',now(),now());

INSERT INTO APP VALUES(0,'销售一点通','123qwe','sales.benlai.com',now());