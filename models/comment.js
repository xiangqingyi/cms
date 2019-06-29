'use strict';

/**
 * 模块依赖
 */
let mongoose = require('mongoose')
let Schema = mongoose.Schema

/**
 *  反馈模型
 */
let CommentSchema = new Schema({
  content: {
    type: String,
    required: true
  },

  author: {
    type: Schema.ObjectId,
    ref: 'User'
  },

  created: {
    type: Date,
    default: Date.now
  },

  status: {
    type: Number,
    default: 0
  }
});

/*CommentSchema.pre('save', function(next) {
    if (!this.isNew) return next();
    if (!this.title) {
        next(new Error('Invalid password'));
    } else {
        next();
    }
});*/

CommentSchema.methods = {

};

mongoose.model('Comment', CommentSchema);
