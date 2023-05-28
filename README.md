# 毕业设计管理系统
## Build Instructions
1. 配置环境
    下载安装包：

    访问 <https://nodejs.org/zh-cn/>

    左侧按钮上写着“推荐多数用户使用（LTS）”，点击下载。

    双击下载的安装包，按照提示即可安装。
1. 安装依赖

    `npm install`
2. 运行

    `$ENV:DEBUG = "gpms:*"; npm start`

    在浏览器中打开 <http://localhost:3000/>
## Developer Documentation
每次修改代码前从远程仓库拉取最新版本，更新文件开发状态：

- [x]表示这个文件在开发中
- [ ]表示这个文件目前没有人在开发
- [o]表示这个文件开发完成

开发结束后更细状态并推送至远程仓库。
以上用于防止多人开发同一文件产生冲突。

此外：
* 向远程仓库推送前应确保项目目前能够正常编译运行。
* 产生的目标文件或二进制文件应写在gitignore中。

## SQL Tables

### Account
* userName
* password
* dateCreated
* accLevel 账号级别：0-管理员，1-教师，2-学生

### Student
* stuNum
* stuName
* stuMajor
* stuGrade
* phoneNum
* email
* **userName**
* **topicId**

### Professor
* profNum
* profName
* profCollege 所属学院
* phoneNum
* email
* profile 教师个人简介
* **userName**

### Administrator
* AdminNum
* **userName**

### Topic
* topicId
* topicName
* profile 课题简介
* postDate 发布日期
* state 状态：0-未被选择，1-正在进行，2-已结束
* grades
* **profNum**

### Paper
* paperId
* paperPath
* grades
* **stuNum**

### Defense
* defID
* instGrades 指导教师评分
* profGrades 评阅教师评分
* defDate 答辩日期+时间
* **topicID**

## 开发状态

### /models
[ ]

### /controllers
[ ]

### /routes
[ ]

### views
[ ]
