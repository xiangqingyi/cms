'use strict';

let monogoose = require('mongoose');
let Award = monogoose.model('Award');
let User = monogoose.model('User');
let util = require('../../lib/util');
let _ = require('lodash');


// 奖励列表
exports.list = async (req, res) => {
    console.log('获取奖励列表');
    try {
        let counts = await Award.count();
        let pageInfo = util.createPage(req.query.page, counts);
        let awards = await Award.find({}).populate('awarduser').populate('duty').sort({created: -1}).exec();
        return res.render('server/award/list', {
            awards: awards,
            pageInfo: pageInfo
        })
    } catch (error) {
        console.log(error);
        return res.render('server/info', {
            message: "获取奖励列表失败"
        })
    }
};


// 增加奖励
exports.add = async (req, res) => {
    console.log('增加奖励');
    let duty = await User.findOne({isduty: true},{_id: 1, name: 1}).exec();
    if (req.method === 'GET') {
        let users = await User.find({}).exec();
        return res.render('server/award/add', {
            Menu: 'add',
            users: users,
            duty: duty
        })
    } else if (req.method === 'POST') {
        let obj = _.pick(req.body, 'awarduser', 'reason', 'award');
        console.log(req.body);
        let award = new Award({
            ...obj,
            duty: duty._id
        });
        await award.save();
        await User.update({_id: obj.awarduser}, {$inc: {awardcount: 1, award: Number(obj.award)}}).exec();
        return res.json({
            status: 1,
            message: '创建奖励成功'
        })
    }
}

// 删除奖励
exports.del = async (req, res) => {
    console.log('删除奖励');
    let id = req.params.id;
    try {
        let award = await Award.findById(id).populate('awarduser');
        await User.update({_id: award.awarduser._id}, {$inc: {awardcount: -1, award: -Number(award.award)}}).exec();
        await Award.remove({_id: id});
        return res.json({
            status: 1,
            message: '删除成功'
        })
    } catch (error) {
        console.log(error);
        return res.json({
            message: '删除失败'
        })        
    }
}