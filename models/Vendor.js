const mongoose = require('mongoose')
const Schema = mongoose.Schema
const mongoosePaginate = require('mongoose-paginate')

const VendorSchema = new Schema({
  name: String,
  openingHours: String,
  district: String,
  location: String,
  items: [String]
})
VendorSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Vendor', VendorSchema)
