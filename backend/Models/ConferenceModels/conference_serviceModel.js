import mongoose from 'mongoose';
import { ConferenceDB } from '../../db.js';


const conferenceServiceSchema = new mongoose.Schema({
  title: {type: String, required: true},
  dates : {type: String},
  location: {type: String},
  abstract : {type : String},
  link: {type: String}
}, {collection: 'conference_service'})



const ConferenceService = ConferenceDB.model('conference_service', conferenceServiceSchema)
export {  ConferenceService };
