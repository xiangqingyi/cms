'use strict';

/**
 * 模块依赖
 */
let mongoose = require('mongoose')
let Schema = mongoose.Schema

/**
 * 文件模型
 */
let FileSchema = new Schema({
  name: {
    type: String
  },
  url: {
    type: String
  },
  md_url: {
    type: String
  },
  sm_url: {
    type: String
  },
  covers: Array,
  size: Number,
  type: String,
  description: String,
  created: {
    type: Date,
    default: Date.now
  },
  author: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  status: {
    type: Number,
    default: 0
  },
  md5: String
});
FileSchema.methods = {

};

mongoose.model('File', FileSchema);
