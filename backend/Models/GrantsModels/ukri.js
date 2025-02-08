import mongoose from 'mongoose';
import { ResearchGrantsDB } from '../../db.js';


const ukriSchema = new mongoose.Schema({
  title: {type:String},
  link : {type : String},
  description : {type : String},
  funders : {type : String, default : null},
  total_fund : {type : String, default : null},
  opening_date : {type : String},
  closing_date : {type : String},

}, {collection: 'ukrigrants'});



const UkriGrants = ResearchGrantsDB.model('ukri', ukriSchema);
export { UkriGrants };
