'use strict';

/**
 * 模块依赖
 */
let mongoose = require('mongoose')
let Schema = mongoose.Schema

/**
 * 日志模型
 */
let LogSchema = new Schema({
  type: {
    type: String   // || 惩罚
  },
  
  name: {
    type: String
  },

  status: {
    type: String
  },
 
  total: {
    type: Number,
  },
  message: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  },
  author: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});
LogSchema.methods = {

};

mongoose.model('Log', LogSchema);
