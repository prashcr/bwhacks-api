const mongoose = require('mongoose')
const Schema = mongoose.Schema
const mongoosePaginate = require('mongoose-paginate')

const ItemSchema = new Schema({
  name: String,
  image: String,
  type: String,
  price: Number,
  tags: [String]
})
ItemSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Item', ItemSchema)
