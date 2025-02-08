import mongoose from 'mongoose';
import { ConferenceDB } from '../../db.js';


const conferenceListsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  dates: {type:String},
  location: {type: String},
  type: {type: String},
  link: {type: String}
});



const ConferenceLists = ConferenceDB.model('conferencelists', conferenceListsSchema);
export { ConferenceLists };
