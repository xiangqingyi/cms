# 目的（纯属娱乐）
每日正能量群管理系统，
管理群成员，管理惩罚列表，管理经费列表
以后说不定还会增加需求

# Manager

> coding in process with no guaranteed stability

# Usage

## Environment required

- [nodejs](https://nodejs.org/) >= 7.9.0   (for ``async/await`` refer [node.green](http://node.green/))
- [mongodb](https://www.mongodb.org/) >= 3.4


## Install dependencies

````
$ npm install
````

## Initialize config file

````
$ cp config.default.js config.js
````

## Start Service

### Development

````
$ npm start
````

### Production

````
$ npm run server
````

or

````
$ NODE_ENV=production node app
````

## Administrator account

open http://localhost:7000/admin/  follow the prompts to install

