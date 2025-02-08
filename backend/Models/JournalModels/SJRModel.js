import mongoose from 'mongoose';
import { ResearchJournalsDB } from '../../db.js';


const SJRJournalSchema = new mongoose.Schema({
  title: {type:String},
  country_flag: {type: String},
  subject_areas : {type: [String]},
  publisher : {type : String},
  coverage : {type : String},
  homepage : {type : String},
  publish_guide : {type : String},
  contact_email : {type : String},
  link : {type : String},

}, {collection: 'SJR'});



const SJRJournals = ResearchJournalsDB.model('SJR', SJRJournalSchema);
export { SJRJournals };
