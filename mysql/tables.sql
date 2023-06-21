-- Active: 1685360827939@@127.0.0.1@3306@gpms

CREATE DATABASE gpms
    DEFAULT CHARACTER SET = 'utf8mb4';

DROP TABLE IF EXISTS `defgradegroup`;
DROP TABLE IF EXISTS `Paper`;
DROP TABLE IF EXISTS `Defense`;
DROP TABLE IF EXISTS `Student`;
DROP TABLE IF EXISTS `Topic`;
DROP TABLE IF EXISTS `Professor`;
DROP TABLE IF EXISTS `Administrator`;
DROP TABLE IF EXISTS `Account`;

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
    `finalGrades` INT,
    `topicId` INT(10),
    PRIMARY KEY (`defId`),
    CONSTRAINT FK_DE_TO Foreign Key (`topicId`) REFERENCES `Topic`(`topicId`) ON DELETE CASCADE
);

CREATE TABLE `defGradeGroup`(
    `defId` INT(10) AUTO_INCREMENT,
    `profNum` CHAR(10),
    `grades` INT,
    PRIMARY KEY (`defId`,`profNum`),
    CONSTRAINT FK_DG_DE Foreign Key (`defId`) REFERENCES `Defense`(`defId`) ON DELETE CASCADE,
    CONSTRAINT FK_DG_PO Foreign Key (`profNum`) REFERENCES `Professor`(`profNum`) ON DELETE CASCADE
);

-- 更新topic选择状态触发器
DELIMITER //
DROP TRIGGER IF EXISTS upTopicState;
CREATE TRIGGER upTopicState
AFTER UPDATE 
ON student FOR EACH ROW
BEGIN
    IF OLD.topicId IS NULL THEN
        UPDATE topic SET state = 1
            WHERE topicId = NEW.topicId;
    END IF;
END //
DELIMITER;

-- 更新最终成绩，以及topic状态完成触发器
DELIMITER //
DROP TRIGGER IF EXISTS upDefGrades;
CREATE TRIGGER upDefGrades
AFTER UPDATE 
ON defGradeGroup FOR EACH ROW
BEGIN
    DECLARE gradesLeft INT;
    DECLARE fGrades INT;
    DECLARE fTopicId INT;
    DECLARE defTimes INT;

    SELECT COUNT(*) FROM defGradeGroup
        WHERE defId = OLD.defId AND grades IS NULL
        INTO gradesLeft;

    IF gradesLeft = 0 THEN
        SELECT AVG(grades) FROM defGradeGroup
            WHERE defId = OLD.defId
            INTO fGrades;
        UPDATE defense SET finalGrades = fGrades
            WHERE defId = OLD.defId;

        SELECT topicId FROM defense
            WHERE defId = OLD.defId
            INTO fTopicId;
        SELECT COUNT(*) FROM defense
            WHERE topicId = fTopicId
            INTO defTimes;
        IF fGrades >= 60 OR defTimes = 2 THEN
            UPDATE topic SET state = 2
                WHERE topicId = fTopicId;
        END IF;
    END IF;
END //
DELIMITER ;

--查询答辩
DELIMITER //
DROP PROCEDURE IF EXISTS getDefList;
CREATE PROCEDURE getDefList(IN user VARCHAR(20))
BEGIN
    DECLARE prof CHAR(10);
    SELECT profNum FROM professor
        WHERE userName = user LIMIT 1
        INTO prof;

    SELECT profNum FROM professor
            WHERE userName = user;

    SELECT defense.defId as defId, topic.topicName as topicName,
        defense.defDate as defDate, defense.defAddress as defAddress,
        defense.finalGrades as finGrades, defGradeGroup.grades as myGrades 
        FROM defense, topic, defGradeGroup 
        WHERE defense.defId = defGradeGroup.defID 
        AND defGradeGroup.profNum = prof 
        AND topic.topicId = defense.topicId;
END //
DELIMITER;


DELIMITER //
DROP PROCEDURE IF EXISTS checkDefProf;
CREATE PROCEDURE checkDefProf(IN topicIdCheck INT(10),IN user VARCHAR(20))
BEGIN
    DECLARE prof CHAR(10);
    SELECT profNum FROM professor WHERE userName = user 
        INTO prof;
    SELECT COUNT(*) as chk FROM topic 
        WHERE topicId = topicIdcheck AND profNum = prof;
END //
DELIMITER;

call getDefList('pro1');
call checkDefProf(1,'pro1');