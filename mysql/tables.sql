-- Active: 1685360827939@@127.0.0.1@3306@gpms

CREATE DATABASE gpms
    DEFAULT CHARACTER SET = 'utf8mb4';
DROP TABLE `Paper`;
DROP TABLE `Defense`;
DROP TABLE `Topic`;
DROP TABLE `Student`;
DROP TABLE `Professor`;
DROP TABLE `Administrator`;
DROP TABLE `Account`;

CREATE TABLE `Account`(
    `userName` VARCHAR(20),
    `password` VARCHAR(20) NOT NULL,
    `dateCreated` DATE DEFAULT (curdate()),
    `accLevel` INT DEFAULT 0,
    PRIMARY KEY (`userName`),
    CHECK (`accLevel` IN (0,1,2))
);

CREATE TABLE `Professor`(
    `profNum` CHAR(10),
    `profName` VARCHAR(20) NOT NULL,
    `profCollege` VARCHAR(20),
    `phoneNum` VARCHAR(20),
    `email` VARCHAR(20),
    `profile` VARCHAR(200),
    `userName` VARCHAR(20),
    PRIMARY KEY (`profNum`),
    CONSTRAINT FK_PO_AC Foreign Key (`userName`) REFERENCES `Account`(`userName`) ON DELETE CASCADE
);

CREATE TABLE `Administrator`(
    `adminNum` CHAR(10) NOT NULL,
    `userName` VARCHAR(20) NOT NULL,
    `adminName` VARCHAR(20) NOT NULL,
    PRIMARY KEY (`adminNum`),
    CONSTRAINT FK_AD_AC Foreign Key (`userName`) REFERENCES `Account`(`userName`) ON DELETE CASCADE
);

CREATE TABLE `Topic`(
    `topicId` INT(10) AUTO_INCREMENT,
    `topicName` VARCHAR(50),
    `profile` VARCHAR(200),
    `postDate`DATE DEFAULT (curdate()),
    `state` INT DEFAULT 0,
    `grades` INT,
    `profNum` CHAR(10),
    PRIMARY KEY (`topicId`),
    CONSTRAINT FK_TO_PO Foreign Key (`profNum`) REFERENCES `Professor`(`profNum`) ON DELETE CASCADE
);

CREATE TABLE `Student`(
    `stuNum` CHAR(10),
    `stuName` VARCHAR(20) NOT NULL,
    `stuMajor` VARCHAR(20),
    `stuGrade` INT DEFAULT 0,
    `phoneNum` VARCHAR(20),
    `email` VARCHAR(20),
    `userName` VARCHAR(20),
    `topicId` INT(10),
    PRIMARY KEY (`stuNum`),
    CONSTRAINT FK_ST_AC Foreign Key (`userName`) REFERENCES `Account`(`userName`) ON DELETE CASCADE
);

CREATE TABLE `Paper`(
    `paperId` INT(10) AUTO_INCREMENT,
    `paperName` VARCHAR(50),
    `paperPath` VARCHAR(50),
    `uploadDate`DATE DEFAULT (curdate()),
    `grades` INT,
    `stuNum` CHAR(10),
    PRIMARY KEY (`paperId`),
    CONSTRAINT FK_PA_ST Foreign Key (`stuNum`) REFERENCES `Student`(`stuNum`) ON DELETE CASCADE
);

CREATE TABLE `Defense`(
    `defId` INT(10) AUTO_INCREMENT,
    `defDate`DATETIME,
    `defAddress` VARCHAR(50),
    `instGrades` INT,
    `topicId` INT(10),
    PRIMARY KEY (`defId`),
    CONSTRAINT FK_DE_TO Foreign Key (`topicId`) REFERENCES `Topic`(`topicId`) ON DELETE CASCADE
);