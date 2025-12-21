const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  mobile: {
    type: String,
    trim: true,
  },
  alternateMobile: {
    type: String,
    trim: true,
  },
  address: {
    houseFlatNo: { type: String, trim: true },
    streetArea: { type: String, trim: true },
    city: { type: String, trim: true },
    district: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true },
    pinZipCode: { type: String, trim: true },
  },
  currentAddress: {
    sameAsPermanent: { type: Boolean, default: false },
    houseFlatNo: { type: String, trim: true },
    streetArea: { type: String, trim: true },
    city: { type: String, trim: true },
    district: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true },
    pinZipCode: { type: String, trim: true },
  },
  idProofType: {
    type: String,
    enum: ['Aadhaar Card', 'Passport', 'Voter ID', 'Driving License'],
    trim: true,
  },
  idProofFile: {
    type: String,
    trim: true,
  },
  education: {
    type: String,
    trim: true,
  },
  job: {
    type: String,
    trim: true,
  },
  gender: {
    type: String,
    trim: true,
  },
  dateOfBirth: {
    type: Date,
  },
  age: {
    type: Number,
  },
  nationality: {
    type: String,
    trim: true,
  },
  maritalStatus: {
    type: String,
    trim: true,
  },
  bloodGroup: {
    type: String,
    trim: true,
  },
  languagesKnown: {
    type: [String],
  },
  previousNgoExperience: {
    hasExperience: { type: Boolean, default: false },
    details: { type: String, trim: true },
  },
  socialMediaProfiles: {
    linkedIn: { type: String, trim: true },
    facebook: { type: String, trim: true },
    instagram: { type: String, trim: true },
  },
  interest: {
    type: String,
    trim: true,
  },
  position: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['New', 'Pending', 'Talk', 'Approved'],
    default: 'New',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Membership', membershipSchema);