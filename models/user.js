
/**
 * 用户相关逻辑中间件
 * 注册、登录、更新用户信息。
 */

 const mongoose = require('mongoose')
 const Schema = mongoose.Schema

 const userSchema = new Schema({
   username: {type: String, min: 3, max: 16, required: true},
   passward: {type: String, required: true},
   avatar: {type: String, required: true},
   borrows: {type: Number},
   status: {type: String, enum: ['free', 'blocked'], default: 'free'},
   due_books: {type: Number},
 })

 module.exports = mongoose.model('User', userSchema)