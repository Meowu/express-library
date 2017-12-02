const mongoose = require('mongoose')
const moment = require('moment')

const Schema = mongoose.Schema

const AuthorSchema = new Schema({
  first_name: {type: String, required: true, max: 30},
  family_name: {type: String, required: true, max: 30},
  date_of_birth: {type: Date},
  date_of_death:  {type: Date},
})

// Virtual for author's full name
AuthorSchema
.virtual('name')
.get(function () {
  return this.family_name + ', ' + this.first_name
})

AuthorSchema
.virtual('birth_field')
.get(function() {
  return this.date_of_birth ? moment(this.date_of_birth).format('YYYY-MM-DD') : ''
})

AuthorSchema
.virtual('death_field')
.get(function() {
  return this.date_of_death ? moment(this.date_of_death).format('YYYY-MM-DD') : ''
})

AuthorSchema
.virtual('birthday_formatted')
.get(function () {
  return this.date_of_birth ? moment(this.date_of_birth).format('MMMM Do, YYYY'): ''
})

AuthorSchema
.virtual('deathday_formatted')
.get(function () {
  return this.date_of_death ? moment(this.date_of_death).format('MMMM Do, YYYY'): ''
})
// Note: Declaring our URLs as a virtual in the schema is a good idea because then the URL for an item only ever needs to be changed in one place.
// At this point a link using this URL wouldn't work, because we haven't got any routes handling code for individual model instances.
AuthorSchema
.virtual('url')
.get(function () {
  return '/catalog/author/' + this._id
})

module.exports = mongoose.model('Author', AuthorSchema)