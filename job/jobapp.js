
let schedule = require('node-schedule');
let mongoose = require('mongoose');
let config = require('../config');
let changeduty = require('./jobs/changeduty');

// 连接数据库
mongoose.Promise = global.Promise;
mongoose.connect(config.mongodb.uri, { useNewUrlParser: true }).then(function (db) {
    console.log('mongodb连接成功')
}, function(err) {
    console.log('mongodb连接失败',err);
})
console.log('每周一更换管理员');
try {
    const jobs = [];
    function createJob(jobid, jobtime, jobfn) {
        jobs[jobid] = schedule.scheduleJob(jobtime, jobfn);
    }
//  每周一凌晨三点更换值日生
    // changeduty.changeduty();
    createJob('changeduty', '0 3 * * 1', changeduty.changeduty);

} catch (error) {
    console.log('定时切换值日生失败', error, new Date());
}