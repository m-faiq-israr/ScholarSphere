import mongoose from 'mongoose';

const CONFERENCE_DB_URI = "mongodb+srv://scholarspherefyp:GQwYK0t2FkqpUzyt@scholarsphere.0segx.mongodb.net/Conferences";
const JOURNALS_DB_URI = "mongodb+srv://scholarspherefyp:GQwYK0t2FkqpUzyt@scholarsphere.0segx.mongodb.net/Journals";
const GRANTS_DB_URI = "mongodb+srv://scholarspherefyp:GQwYK0t2FkqpUzyt@scholarsphere.0segx.mongodb.net/Grants";

const ConferenceDB = mongoose.createConnection(CONFERENCE_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const JournalsDB = mongoose.createConnection(JOURNALS_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const GrantsDB = mongoose.createConnection(GRANTS_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});



ConferenceDB.on('connected', () => {
  console.log('Connected to ConferenceDB successfully');
});

ConferenceDB.on('error', (error) => {
  console.error('Error connecting to ConferenceDB:', error);
});

JournalsDB.on('connected', () => {
  console.log('Connected to ResearchJournalsDB successfully');
});

JournalsDB.on('error', (error) => {
  console.error('Error connecting to ResearchJournalsDB:', error);
});

GrantsDB.on('connected', () => {
  console.log('Connected to GrantsDB successfully');
});

GrantsDB.on('error', (error) => {
  console.error('Error connecting to GrantsDB:', error);
});


export {ConferenceDB,  JournalsDB, GrantsDB };
