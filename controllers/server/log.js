'use strict';

let mongoose = require('mongoose')
let Log = mongoose.model('Log')
let util = require('../../lib/util')
let User = mongoose.model('User');
let _ = require('lodash');

//列表
exports.list = async (req, res) => {
  // 获取所有经费
  try {
    let users = await User.find({}, {_id: 0, fined: 1});
    let all = _.sumBy(users, 'fined');
    return res.render('server/log/list', {
      all: all
    })
  } catch (error) {
    console.log(error);
    return res.render('server/info', {
      message: '获取所有经费失败'
    })
  }
}

//单条
exports.one = function (req, res) {
  let id = req.params.id;
  Log.findById(id).populate('author', 'username name').exec(function (err, result) {
    console.log(result);
    if (!result) {
      return res.render('server/info', {
        message: '该页面不存在'
      });
    }
    res.render('server/log/item', {
      data: result
    });
  });
};
//删除
exports.del = function (req, res) {
  let id = req.params.id;
  Log.findById(id).populate('author').exec(function (err, result) {
    if (!result) {
      return res.render('server/info', {
        message: '留言不存在'
      });
    }
    let isAdmin = req.isAdmin;
    let isAuthor = result.author && ((result.author._id + '') === req.session.user._id);

    if (!isAdmin && !isAuthor) {
      return res.render('server/info', {
        message: '没有权限'
      });
    }
    console.log(result)
    result.remove(function (err) {
      if (req.xhr) {
        return res.json({
          status: !err
        });
      }
      if (err) {
        return res.render('server/info', {
          message: '删除失败'
        });
      }
      res.render('server/info', {
        message: '删除成功'
      })
    });
  });
};
