import mongoose from 'mongoose';
import { GrantsDB } from '../../db.js';

const grantSchema = new mongoose.Schema({
  title: { type: String, default: null},
  link: { type: String, default: null},
  description: { type: String, default: null},
  total_fund: { type: String, default: null},
  opening_date: { type: String, default: null},
  closing_date: { type: String, default: null},
  who_can_apply: { type: String, default: null},
  scope: { type: String, default: null},
  opportunity_status: {type: String, default: null},
  contact_email: {type: String, default: null},

}, { strict: false }); 


const Grants = GrantsDB.model('grants', grantSchema, 'allGrants');

export {
  Grants
};
