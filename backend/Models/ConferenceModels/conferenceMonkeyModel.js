import mongoose from 'mongoose';
import { ConferenceDB } from '../../db.js';

const conferenceMonkeySchema = new mongoose.Schema({
  title: { type: String },
  location: { type: String },
  dates: { type: String },
  link: { type: String }
}, { collection: 'conferencemonkey' }); 

const ConferenceMonkey = ConferenceDB.model('conferencemonkey', conferenceMonkeySchema);
export { ConferenceMonkey };
