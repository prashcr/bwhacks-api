const mongoose = require('mongoose')
const Schema = mongoose.Schema
const timestamps = require('mongoose-timestamps')
const mongoosePaginate = require('mongoose-paginate')

const OrderSchema = new Schema({
  vendor: String,
  totalCost: Number,
  items: []
})
OrderSchema.plugin(timestamps)
OrderSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Order', OrderSchema)
