
let User = require('../../models/user');


exports.changeduty = async (req, res) => {
    console.log('开始更换值日生');
    try {
        let old = await User.findOne({isduty: true}).exec();
        let count = await User.count({}).exec();
        let newid = (old.id + 1 > count) ? 1 : old.id + 1
        await User.update({id: newid}, {$set: {
            isduty: true
        }});
        await User.update({id: old.id}, {$set: {
            isduty: false
        }})
    } catch (error) {
        console.log('更换值日生失败', error);
    }

}