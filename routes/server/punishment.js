'use strict';

let express = require('express');
let router = express.Router();
let util = require('../../lib/util');
let punishment = require('../../controllers/server/punishment');

// 判断是否登录
router.use(function (req, res, next) {
    res.locals.Path = 'punishment';
    if (!req.session.user) {
        let path = util.translateAdminDir('/user/login');
        return res.redirect(path);
    }
    next();
})

// 惩罚列表
router.route('/').get(punishment.list);

// 增加惩罚
router.route('/add').all(punishment.add);

// 单条惩罚
// router.route('/:id').get(punishment.one);

// 编辑惩罚
router.route('/:id/edit').all(punishment.edit);

// 删除惩罚
router.route('/:id/del').post(punishment.del);




module.exports = function (app) {
    let path = util.translateAdminDir('/punishment');
    app.use(path, router);
}