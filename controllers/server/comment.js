'use strict';

let mongoose = require('mongoose')
let Comment = mongoose.model('Comment')
let util = require('../../lib/util')
let _ = require('lodash');

// 反馈列表
exports.list = async (req, res) => {
  console.log('获取反馈列表');
  try {
    let counts = await Comment.count({}).exec();
    let pageInfo = util.createPage(req.query.page, counts)
    let comments = await Comment.find({}).populate('author').skip(pageInfo.start).limit(pageInfo.pageSize).sort({created: -1});
    return res.render('server/comment/list', {
      comments: comments,
      pageInfo: pageInfo
    })
  } catch (error) {
    console.log(error);
    return res.render('server/info', {
      message: '获取反馈列表失败'
    })
  }
};


// 增加反馈
exports.add = async (req, res) => {
  console.log('增加反馈');
  if (req.method === 'GET') {
    return res.render('server/comment/add', {
      Menu: 'add',
    })
  } else if (req.method === 'POST') {
    let obj = _.pick(req.body, 'content')
    let comment = await Comment({
      ...obj,
      author: req.session.user._id
    });
    await comment.save();
    return res.json({
      status: 1,
      message: "创建反馈成功"
    })
  }
}


//删除
exports.del = function (req, res) {
  let id = req.params.id;
  Comment.findById(id).populate('author').populate('from').exec(function (err, result) {
    if (!result) {
      return res.render('server/info', {
        message: '评论不存在'
      });
    }

    let isAdmin = req.isAdmin;
    let isOwner = result.from && ((result.from.author + '') === req.session.user._id);

    if (!isAdmin && !isOwner) {
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
