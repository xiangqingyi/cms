'use strict';

let express = require('express');
let router = express.Router();
let util = require('../../lib/util');
let award = require('../../controllers/server/award');

// 判断是否登录
router.use(function (req, res, next) {
    res.locals.Path = 'award';
    if (!req.session.user) {
        let path = util.translateAdminDir('/user/login');
        return res.redirect(path);
    }
    next();
})

// 奖励列表
router.route('/').get(award.list);

// 增加奖励
router.route('/add').all(award.add);

// 删除惩罚
router.route('/:id/del').post(award.del);

module.exports = function (app) {
    let path = util.translateAdminDir('/award');
    app.use(path, router);
}