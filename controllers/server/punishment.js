'use strict';

let mongoose = require('mongoose');
let Punishment = mongoose.model('Punishment');
let User = mongoose.model('User');
let util = require('../../lib/util');
let _ = require('lodash');

// 惩罚列表
exports.list = async (req,res) => {
    console.log('获取惩罚列表');

    try {
        let counts = await Punishment.count();
        let pageInfo = util.createPage(req.query.page, counts);
        let punishments = await Punishment.find({}).populate('mistakeuser').populate('duty').skip(pageInfo.start).limit(pageInfo.pageSize).sort({created: -1}).exec()
        console.log(punishments)
        console.log(pageInfo);
        return res.render('server/punishment/list', {
            punishments: punishments,
            pageInfo: pageInfo
        })
    } catch (error) {
        console.log(error);
        return res.render('server/info', {
            message: '获取惩罚列表失败'
        })
    } 
};

// 单条惩罚
exports.one = async (req, res) => {
    try {
        let id = req.params.id;
        console.log(id);
        let result = await Punishment.findById(id).populate('user').exec();
        if (!result) {
            return res.render('server/info', {
                message: "该条惩罚不存在"
            })
        }
        return res.render('server/punishment/item', {
            title: "惩罚详情",
            punishment: result
        })
    } catch (error) {
        
    }
}

// 编辑惩罚
exports.edit = async (req, res) => {
    if (req.method === 'GET') {
        try {
            let id = req.params.id;
            let users = await User.find({}).exec();
            let result = await Punishment.findById(id).populate('mistakeuser').populate('duty').exec();
            return res.render('server/punishment/edit', {
                punishment: result,
                users: users  
            })
        } catch (error) {
            console.log(error);
            return res.render('server/info', {
                message:'获取punishment错误'
            })
        }
    } else if(req.method === 'POST'){
        // let obj = _.pick(req.body, )
    }

}

// 删除惩罚
exports.del = async (req, res) => {
    let id = req.params.id;
    try {
        await Punishment.remove({_id: id})
        return res.render('server/info', {
            message: "删除成功"
        })
    } catch (error) {
        console.log(error);
        return res.render('server/info', {
            message: '删除惩罚失败'
        })
    }

}

// 添加惩罚
exports.add = async (req, res) => {
    console.log('增加惩罚');
    let duty = await User.findOne({isduty: true}).exec();
    if (req.method === 'GET') {
        let users = await User.find({}).exec();
        return res.render('server/punishment/add', {
            Menu: 'add',
            users: users,
            duty: duty
        })
    } else if (req.method === 'POST') {
        let obj = _.pick(req.body, 'mistakeuser', 'reason', 'fined');
        console.log(req.body)
        console.log(obj);
        let punishment = new Punishment({
            ...obj,
            duty: duty._id
        });
        await punishment.save();
        // 更新用户犯错次数
        await User.update({_id: obj.mistakeuser}, {$inc:{count: 1, fined: Number(obj.fined)}})
        return res.json({
            status: 1,
            message: "创建惩罚成功"
        })
    }
}