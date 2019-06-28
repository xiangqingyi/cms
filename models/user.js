'use strict';

let crypto = require('crypto');
let _ = require('lodash');
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// 老表模型
let UserSchema = new Schema({
    username: {
        type: String,
        required: "请输入用户名",
        unique: true
    },


    name: {
        type: String
    },

    birthday: {
        type: Date,
        default: Date.now
    },

    address: {
        type: String
    },
    roles: [{
        type: Schema.ObjectId,
        ref: 'Role'
    }],
    count: {
        type: Number,
        default: 0
    },

    created: {
        type: Date,
        default: Date.now
    },
    status: {
        type: Number,
        default: 101
    },

    salt: String,
    hashed_password: String

})

UserSchema.virtual('password').set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.hashPassword(password);
}).get(function() {
    return this._password;
})

UserSchema.methods = {
    // 密码验证
    authenticate: function(plainText) {
        return this.hashPassword(plainText) === this.hashed_password;
    },
    makeSalt: function() {
        return Math.round((new Date().valueOf() * Math.random())) + '';
    },
    hashPassword: function (password) {
        if (!password) return '';
        let encrypred;
        try {
            encrypred = crypto.createHmac('sha1', this.salt).update(password).digest('hex');
            return encrypred;
        } catch (error) {
            return ''
        }
    }
}

module.exports = mongoose.model('User', UserSchema);