import mongoose from 'mongoose';

const CONFERENCE_DB_URI = "mongodb+srv://scholarspherefyp:GQwYK0t2FkqpUzyt@scholarsphere.0segx.mongodb.net/Conferences";
const RESEARCH_JOURNALS_DB_URI = "mongodb+srv://scholarspherefyp:GQwYK0t2FkqpUzyt@scholarsphere.0segx.mongodb.net/ResearchJournals";
const RESEARCH_GRANTS_DB_URI = "mongodb+srv://scholarspherefyp:GQwYK0t2FkqpUzyt@scholarsphere.0segx.mongodb.net/ResearchGrants";

const ConferenceDB = mongoose.createConnection(CONFERENCE_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const ResearchJournalsDB = mongoose.createConnection(RESEARCH_JOURNALS_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const ResearchGrantsDB = mongoose.createConnection(RESEARCH_GRANTS_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

ConferenceDB.on('connected', () => {
  console.log('Connected to ConferenceDB successfully');
});

ConferenceDB.on('error', (error) => {
  console.error('Error connecting to ConferenceDB:', error);
});

ResearchJournalsDB.on('connected', () => {
  console.log('Connected to ResearchJournalsDB successfully');
});

ResearchJournalsDB.on('error', (error) => {
  console.error('Error connecting to ResearchJournalsDB:', error);
});

ResearchGrantsDB.on('connected', () => {
  console.log('Connected to ResearchGrantsDB successfully');
});

ResearchGrantsDB.on('error', (error) => {
  console.error('Error connecting to ResearchGrantsDB:', error);
});

export { ConferenceDB, ResearchJournalsDB, ResearchGrantsDB };
