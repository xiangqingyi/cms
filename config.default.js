'use strict';

let appPath = process.cwd();
let config = {
    port: 7000,
    env: process.env.NODE_ENV || 'development', // development   production
    //mongodb配置信息
    mongodb: {
        uri: 'mongodb://localhost/cms',
        options: {}
    },
    //redis服务，用来session维持，当不需要redis服务时注释此项
    // redis: {
    //     host: '127.0.0.1',
    //     port: 6379,
    //     pass: ''
    // },
    //找回密码hash过期时间
    findPasswordTill: 24 * 60 * 60 * 1000,
    title: 'CMS',
    //后台相关配置
    admin: {
        dir: 'admin', //后台访问路径，如http://localhost/admin配置为admin
        role: {//默认角色名
            admin: 'admin',
            user: 'user'
        }
    },
    upload: {
        tmpDir:  appPath + '/public/uploaded/tmp',
        uploadDir: appPath + '/public/uploaded/files',
        uploadUrl:  '/uploaded/files/',
        maxPostSize: 100 * 1024 * 1024, // 100M
        minFileSize:  1,
        maxFileSize:  50 * 1024 * 1024, // 50M
        acceptFileTypes:  /.+/i,
        storage: {
            type: 'local',//保存类型，如果保存到本地可省略或local, 目前支持7牛：qiniu
            options: {
                accessKey: 'your key',
                secretKey: 'your secret',
                bucket: 'your bucket',
                domain: 'your domain',
                timeout: 3600000, // default rpc timeout: one hour, optional
            }
        }
    },
    stopForumSpam: false,
    // 是否启动用户注册校验TODO:
    userVerify: {
        enable: false,
        type: 'admin' // mail | admin, 默认admin
    }
    // 邮箱配置，找回密码、用户注册使用
    mail: {
        // 发信人邮箱
        from: 'username@domain.com',
        options: {
            // 邮箱服务host
            host: '10.1.1.1',
            auth: {
                // 发信人用户名
                user: 'username',
                // 发信人密码
                pass: 'password'
            }    
        }
        
    },
    // 短信服务配置TODO:
    sms: {

    }
};

module.exports = config;