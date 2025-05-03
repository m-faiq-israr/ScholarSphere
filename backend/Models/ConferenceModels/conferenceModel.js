import mongoose from 'mongoose';
import { ConferenceDB } from '../../db.js';

const conferenceSchema = new mongoose.Schema({
  title: { type: String, default: null},
  link: { type: String, default: null},
  location: { type: String, default: null},
  start_date: { type: String, default: null},
  end_date: { type: String, default: null},
  topics: { type: String, default: null},

}, { strict: false });


const Conferences = ConferenceDB.model('conferences', conferenceSchema, 'allConferences');

export {
    Conferences
};
