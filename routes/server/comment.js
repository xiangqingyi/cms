'use strict';

let express = require('express')
let router = express.Router()
let util = require('../../lib/util')
let action = require('../../middlewares/action')
let comment = require('../../controllers/server/comment')

//权限判断
router.use(function (req, res, next) {
  console.log('评论页: ' + Date.now());
  res.locals.Path = 'comment';
  if (!req.session.user) {
    let path = util.translateAdminDir('/user/login');
    return res.redirect(path);
  }
  next();
});
//反馈列表
router.route('/').get(action.checkAction('COMMENT_INDEX'), comment.list);
// 添加反馈
router.route('/add').all(comment.add);

//删除信息
router.route('/:id/del').post(action.checkAction('COMMENT_DELETE'), comment.del);

module.exports = function (app) {
  let path = util.translateAdminDir('/comment');
  app.use(path, router);
};
