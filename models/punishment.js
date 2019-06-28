'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// 惩罚模型
let PunishmentSchema = new Schema({
    reason: { // 惩罚原因
        type: String,
        required: true
    },
    fined: { // 惩罚金额
        type: Number,
        required: true
    },
    duty: {   // 值日生
        type: Schema.ObjectId,
        ref: 'User'
    },
    created: {
        type: Date,
        default: Date.now
    },
    status: {
        type: Number,
        default: 0,
    }
    
})

module.exports = mongoose.model('Punishment', PunishmentSchema);