'use strict';

let mongoose = require('mongoose')
let Category = mongoose.model('Category')
let _ = require('lodash')
let util = require('../../lib/util')

//列表
exports.list = function (req, res) {
  let condition = {};
  const isAdmin = req.isAdmin;
  if (!isAdmin) {
    condition.author = req.session.user._id;
  }
  Category.count(condition, function (err, total) {
    let query = Category.find(condition).populate('author');
    //分页
    let pageInfo = util.createPage(req.query.page, total);
    //console.log(pageInfo);
    query.skip(pageInfo.start);
    query.limit(pageInfo.pageSize);
    query.sort({ created: -1 });
    query.exec(function (err, results) {
      //console.log(err, results);
      res.render('server/category/list', {
        //title: '列表',
        categorys: results,
        pageInfo: pageInfo,
        Menu: 'list'
      });
    })
  })

};
//单条
exports.one = function (req, res) {
  let id = req.params.id;
  Category.findById(id).populate('author', 'username name email').populate('parent').exec(function (err, result) {
    console.log(result);
    if (!result) {
      return res.render('server/info', {
        message: '该分类不存在'
      });
    }
    res.render('server/category/item', {
      title: result.name,
      category: result
    });
  });
};
//添加
exports.add = function (req, res) {
  if (req.method === 'GET') {
    let condition = {};
    const isAdmin = req.isAdmin;
    if (!isAdmin) {
      condition.author = req.session.user._id;
    }
    Category.find(condition).exec().then(function (categorys) {
      res.render('server/category/add', {
        Menu: 'add',
        items: categorys || []
      });
    })
  } else if (req.method === 'POST') {
    let obj = _.pick(req.body, 'name', 'flag', 'description', 'parent');
    if (req.session.user) {
      obj.author = req.session.user._id;
    }
    if (!obj.parent) {
      delete obj.parent
    }
    let category = new Category(obj);
    category.save(function (err, category) {
      if (req.xhr) {
        return res.json({
          status: !err
        })
      }
      if (err) {
        return res.render('server/info', {
          message: '创建失败'
        });
      }
      res.render('server/info', {
        message: '创建成功'
      });
    });
  }
};
exports.edit = function (req, res) {
  if (req.method === 'GET') {
    let id = req.params.id;
    Category.findById(id).populate('author').exec(function (err, result) {
      let isAdmin = req.isAdmin;
      let isAuthor = result.author && ((result.author._id + '') === req.session.user._id);

      if (!isAdmin && !isAuthor) {
        return res.render('server/info', {
          message: '没有权限'
        });
      }
      let condition = {};
      if (!isAdmin) {
        condition.author = req.session.user._id;
      }
      Category.find(condition).exec().then(function (categorys) {
        res.render('server/category/edit', {
          category: result,
          items: categorys || []
        });
      })
    });
  } else if (req.method === 'POST') {
    let id = req.params.id;
    let obj = _.pick(req.body, 'name', 'flag', 'description', 'parent');
    if (!obj.parent) {
      delete obj.parent
    }
    Category.findById(id).populate('author').exec(function (err, result) {
      let isAdmin = req.isAdmin;
      let isAuthor = result.author && ((result.author._id + '') === req.session.user._id);

      if (!isAdmin && !isAuthor) {
        return res.render('server/info', {
          message: '没有权限'
        });
      }
      _.assign(result, obj);
      result.save(function (err, category) {
        if (req.xhr) {
          return res.json({
            status: !err
          })
        }
        if (!err) {
          res.render('server/info', {
            message: '更新成功'
          });
        }
      });
    });
  }
};
//删除
exports.del = function (req, res) {
  let id = req.params.id;
  Category.findById(id).populate('author').exec(function (err, result) {
    if (!result) {
      return res.render('server/info', {
        message: '分类不存在'
      });
    }
    let isAdmin = req.isAdmin;
    let isAuthor = result.author && ((result.author._id + '') === req.session.user._id);

    if (!isAdmin && !isAuthor) {
      return res.render('server/info', {
        message: '没有权限'
      });
    }
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
