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


CREATE TABLE IF NOT EXISTS `account`(
`account_id` INT AUTO_INCREMENT,
`username` VARCHAR(20) NOT NULL,
`password` VARCHAR(32) NOT NULL,
`add_time` DATETIME,
`last_time` DATETIME,
PRIMARY KEY (`account_id`)
)ENGINE = InnoDB DEFAULT CHARSET=utf8;

INSERT INTO APP VALUES(0,'销售一点通','123qwe','sales.benlai.com',now());