
const mongoose = require('mongoose')
const path = require('path')

const mongoDB = 'mongodb://127.0.0.1/test'

const current_path = path.resolve(__dirname, '../public/images/avatars')
console.log(current_path);

mongoose.connect(mongoDB, {
  useMongoClient: true
})

const db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connect error.'))

// Models are defined using the Schema interface. The Schema allows you to define the fields stored in each document along with their validation requirements and default values. 
// Defining schemas
const Schema = mongoose.Schema

const AModelSchema = new Schema({
  name: {type: String, minlength: 3, maxlength: 16},
  a_string: String,
  a_date: Date
}, {timestamps: {}})

AModelSchema.path('name').validate(function(v) {
  return !/\^|<|>|\*/.test(v)
}, 'Name can only contain alphanumeric and underscore.')
// Creating a model, Mongoose将会在数据库中创建一个名为MyModels的集合，并且包含AModelSchema中的字段。
const MongoModel = mongoose.model('MyModel', AModelSchema)

const update = {name: 'Meowu', gender: 'male'}
MongoModel.update({}, update, function(err, raw) {
  if (err) console.log(err);
  console.log(raw);
})
// 有save和create两种方法来定义一个model
// const dup = [{name: '_meowuu'}, {name: 'meowu_'}]
// const model_instance = new MongoModel({name: "instance"})
// model_instance.save(function(err) {
//   if (err) return handleError(err)
//   // saved.
// })
// MongoModel.create(dup,   (err, instances) => {
//   if (err) return console.error(err);
//   console.log(instances);
//   // saved.
// })