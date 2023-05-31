-- Active: 1685360827939@@127.0.0.1@3306@gpms
insert into Account value('a1', '1234', '2022-04-02', '0');
insert into Account value('a2', '12345', '2022-04-03', '0');
insert into Account value('b1', '1234', '2022-04-02', '1');
insert into Account value('c1', '1234', '2022-04-03', '2');

insert into professor value('0000', '张三', '计算机科学与技术', '13916548742','aaa@qq.com','你好，我是张三','b1');
insert into topic(topicName,profile,postDate,state,profNum) value('GPMS', '毕业设计管理系统', '2022-04-03','1','0000');
insert into topic(topicName,profile,postDate,state,profNum) value('Path Tracing', '路径追踪', '2022-04-03','0','0000');
insert into student value('1111','梅友仁','计算机科学与技术','3','13612345654','adw@as.cn','c1','1');

select * from topic,professor where topic.profNum = professor.profNum AND topic.state = 0;

select topic.topicId, topic.topicName, topic.profile as tProfile, 
topic.postDate, professor.profName, professor.profile as pProfile,
professor.email, professor.phoneNum, professor.profCollege
from topic,professor 
where topic.profNum = professor.profNum AND topic.topicId = 2;
