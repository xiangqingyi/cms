'use strict';
var mongoose = require('mongoose'),
    Role = mongoose.model('Role'),
    userController = require('./user'),
    util = require('../libs/util');
//列表
exports.list = function(req, res) {
    Role.count(function(err, total) {
        var query = Role.find({});
        //分页
        var pageInfo = util.createPage(req.query.page, total, 10, req);
        query.skip(pageInfo.start);
        query.limit(pageInfo.pageSize);
        query.sort({created: -1});
        query.exec(function(err, results) {
            //console.log(results)
            res.render('server/role/list', {
                roles: results,
                pageInfo: pageInfo
            });
        });
    })
};
//单条
exports.one = function(req, res) {
    var id = req.param('id');
    Role.findById(id).populate('author', 'username name email').exec(function(err, result) {
        console.log(result);
        if(!result) {
            return res.render('server/message', {
                msg: '该内容不存在'
            });
        }
        res.render('server/role/item', {
            title: result.name,
            role: result
        });
    });
};
//添加
exports.add = function(req, res) {
    if (req.method === 'GET') {
        res.render('server/role/add');
    } else if (req.method === 'POST') {
        var obj = req.body;
        obj.actions = obj.actions.split(',').map(function(action) {
            return action.trim();
        });
        var role = new Role(obj);
        role.save(function(err, role) {
            if (err) {
                return res.render('server/message', {
                    msg: '创建失败'
                });
            }
            res.render('server/message', {
                msg: '创建成功'
            });
        });
    }
};
exports.edit = function(req, res) {
    if(req.method === 'GET') {
        var id = req.param('id');
        Role.findById(id, function(err, result) {
            if(result.actions) {
                result.actions = result.actions.join(',');    
            }
            res.render('server/role/edit', {
                role: result
            });
        });
    } else if(req.method === 'POST') {
        var id = req.param('id');
        var obj = req.body;
        obj.actions = obj.actions.split(',').map(function(action) {
            return action.trim();
        });
        Role.findByIdAndUpdate(id, obj, function(err, result) {
            //console.log(err, result);
            if(!err) {
                //重置session信息
                userController.reload(req.session.user._id, function(err, user) {
                    req.session.user = user;
                    res.locals.User = user;
                    if(!err) {
                        res.render('server/message', {
                            msg: '更新成功'
                        });
                    }
                })
            }
        })
    }
};
//删除
exports.del = function(req, res) {
    if(!req.session.user) {
        return res.render('server/message', {
            msg: '请先登录'
        });
    }
    var id = req.params.id;
    Role.findById(id, function(err, result) {
        if(!result) {
            return res.render('server/message', {
                msg: '内容不存在'
            });
        }
        if(!result.author || result.author == req.session.user._id) {
            result.remove(function(err) {
                if(err) {
                    return res.render('server/message', {
                        msg: '删除失败222'
                    });
                }
                //TODO:reload userinfo
                res.render('server/message', {
                    msg: '删除成功'
                })
            });
        }else {
            return res.render('server/message', {
                msg: '你没有权限删除别人的文章'
            });
        }
    });
};