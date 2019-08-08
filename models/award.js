'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// 奖励模型
let AwardSchema = new Schema({
    awarduser: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    reason: {    // 奖励原因
        type: String,
        required: true,
    },
    award: {  // 奖励金额
        type: Number,
        required: true
    },
    duty: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    created: {
        type: Date,
        default: Date.now
    },
    status: {   // 目前是备用字段
        type: Number,
        default: 0,
    }
})

mongoose.model('Award', AwardSchema);