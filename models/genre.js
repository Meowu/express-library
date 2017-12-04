
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const GenreSchema = new Schema({
  name: {type: String, max: 100, min:3},
}, {timestamps: {createdAt: 'create_at', updatedAt: 'update_at'}}) // 默认属性名是createdAt 和 updatedAt，这里是重命名为 created_at, updated_at。时间是ISO时间，toString转为本地时间。

GenreSchema
.virtual('url')
.get(function () {
  return '/catalog/genre/' + this._id
})

module.exports = mongoose.model('Genre', GenreSchema)