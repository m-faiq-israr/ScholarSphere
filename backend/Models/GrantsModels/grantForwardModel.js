import mongoose from 'mongoose';
import { ResearchGrantsDB } from '../../db.js';


const grantForwardSchema = new mongoose.Schema({
  title: {type:String},
  link : {type : String},
  description: {type : String},
  posted_date: {type : String},
  due_date: {type : String},

}, {collection: 'grantforward'});



const GrantForward = ResearchGrantsDB.model('grantforward', grantForwardSchema);
export { GrantForward };
