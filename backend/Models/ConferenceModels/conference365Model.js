import mongoose from 'mongoose';
import { ConferenceDB } from '../../db.js';


const conference365Schema = new mongoose.Schema({
  title: { type: String, required: true },
  dates: {type:String},
  location: {type: String},
  topics: {type: String},
  link: {type: String}
});



const Conference365 = ConferenceDB.model('conference365', conference365Schema);
export { Conference365 };
