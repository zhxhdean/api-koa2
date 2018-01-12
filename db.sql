CREATE DATABASE `frontdb` DEFAULT CHARACTER
SET utf8
COLLATE utf8_general_ci;

CREATE TABLE IF NOT EXISTS `app`(
   `app_id` INT AUTO_INCREMENT,
   `app_name` VARCHAR(20) NOT NULL,
   `token` VARCHAR(32) NOT NULL,
   `domain` VARCHAR(32) NOT NULL,
   `add_time` DATETIME,
   PRIMARY KEY ( `app_id` )
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