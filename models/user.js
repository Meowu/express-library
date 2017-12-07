
/**
 * 用户相关逻辑中间件
 * 注册、登录、更新用户信息。
 */

 const mongoose = require('mongoose')
 const Schema = mongoose.Schema

 const userSchema = new Schema({
  //  _id: {type: Schema.ObjectId},
   username: {type: String, min: 3, max: 16, required: true, unique: true},
   password: {type: String, required: true},
   email: {type: String, required: true,},
   avatar: {type: String},
   borrows: {type: Number},
   status: {type: String, enum: ['free', 'blocked'], default: 'free'},
   due_books: {type: Number},
 }, {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}})

 module.exports = mongoose.model('User', userSchema)