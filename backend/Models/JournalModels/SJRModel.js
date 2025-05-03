import mongoose from 'mongoose';
import { JournalsDB } from '../../db.js';


const JournalSchema = new mongoose.Schema({
  title: {type:String},
  country: {type: String},
  scope : {type: String},
  subject_areas : {type: [String]},
  publisher : {type : String},
  coverage : {type : String},
  homepage : {type : String},
  publish_guide : {type : String},
  contact_email : {type : String},
  link : {type : String},

}, {collection: 'allJournals'});



const Journals = JournalsDB.model('journals', JournalSchema);
export { Journals };
