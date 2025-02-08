import mongoose from 'mongoose';
import { ConferenceDB } from '../../db.js';


const wasetConferenceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: {type: String, default: null},
  date: {type:String},
  url: {type: String}
});



const WasetConference = ConferenceDB.model('wasetconferences', wasetConferenceSchema);
export { WasetConference };
