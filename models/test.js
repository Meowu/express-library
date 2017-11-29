
const mongoose = require('mongoose')

const mongoDB = 'mongodb://127.0.0.1/db'

mongoose.connect(mongoDB, {
  useMongoClient: true
})

const db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connect error.'))

// Models are defined using the Schema interface. The Schema allows you to define the fields stored in each document along with their validation requirements and default values. 
// Defining schemas
const Schema = mongoose.Schema

const AModelSchema = new Schema({
  a_string: String,
  a_date: Date
})

// Creating a model, Mongoose将会在数据库中创建一个名为MyModel的集合，并且包含AModelSchema中的字段。
const MongoModel = mongoose.model('MyModel', AModelSchema)

// 有save和create两种方法来定义一个model
const model_instance = new MongoModel({name: "instance"})
model_instance.save(function(err) {
  if (err) return handleError(err)
  // saved.
})
// or: MongoModel.create({name: 'instance},    (err, instance) => {
//   if (err) return handleError(err)
//   saved.
// })