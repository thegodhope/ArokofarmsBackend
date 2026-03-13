const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  personalInfo: {
    fullName: String,
    dob: Date,
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'] // Matches your dropdown
    },
    email: { type: String, required: true },
    maritalStatus: {
      type: String,
      enum: ['Single', 'Married', 'Divorced', 'Other'] // Matches your radio buttons
    },
    address: String,
    state: String,
    country: String,
    phone1: String,
    phone2: String,
  },
  nextOfKin: {
    fullName: String,
    address: String,
    phone: String,
    relationship: String,
  },
  identification: {
    idType: {
      type: String,
      enum: ['National ID', 'Int\'l Passport', 'Voters Card', 'Drivers License']
    },
    idFile: String,
    passportPhoto: String,
  },
  subscriptionDetails: {
    location: {
      type: String,
      enum: ['Abeokuta, Ogun State', 'Ado Awaye, Oyo State']
    },
    cluster: {
      type: String,
      enum: ['Cocoa Plantain Cluster', 'Cashew Farm Cluster', 'Palm Tree Plantation Cluster', 'Cash Crop Cluster']
    },
    landSize: {
      type: String,
      enum: ['Acre', 'Hectare']
    },
    quantity: { type: Number, default: 1 },
  },
  payment: {
    plan: {
      type: String,
      enum: ['Outright(0-3 Months)', '6 Months']
    },
    amountPaid: { type: Number, min: 500000 }, // Enforcing that minimum 500k
    receiptFile: String,
  },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },


});



module.exports = mongoose.model('Subscription', SubscriptionSchema);