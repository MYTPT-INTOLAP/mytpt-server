const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId

const userHistorySchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        ref: 'user'
    },
    ip: {
        type: String,
        trim: true
    },
    network: {
        type: String,
        trim: true
    },
    version: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    region: {
        type: String,
        trim: true
    },
    region_code: {
        type: String,
        trim: true
    },
    country: {
        type: String,
        trim: true
    },
    country_name: {
        type: String,
        trim: true
    },
    country_code: {
        type: String,
        trim: true
    },
    country_code_iso3: {
        type: String,
        trim: true
    },
    country_capital: {
        type: String,
        trim: true
    },
    country_tld: {
        type: String,
        trim: true
    },
    continent_code: {
        type: String,
        trim: true
    },
    in_eu: {
        type: Boolean,
        default: false
    },
    postal: {
        type: String,
        trim: true
    },
    latitude: {
        type: Number,
    },
    longitude: {
        type: Number,
    },
    timezone: {
        type: String,
        trim: true
    },
    utc_offset: {
        type: String,
        trim: true
    },
    country_calling_code: {
        type: String,
        trim: true
    },
    currency: {
        type: String,
        trim: true
    },
    currency_name: {
        type: String,
        trim: true
    },
    languages: {
        type: String,
        trim: true
    },
    country_area: {
        type: Number,
    },
    country_population: {
        type: Number,
    },
    asn: {
        type: String,
        trim: true
    },
    org: {
        type: String,
        trim: true
    },
    browser: {
        name:{
            type: String,
            trim: true
        },
        version:{
            type: Number,
        }
    },
    os:{
        name:{
            type: String,
            trim: true
        },
        version:{
            type: Number,
        }
    }
}, { timestamps: true, versionkey: false })


module.exports = mongoose.model('Userhistory', userHistorySchema);
