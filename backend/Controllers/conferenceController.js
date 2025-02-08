import express from 'express';
import { Conference365 } from '../Models/ConferenceModels/conference365Model.js';
import { ConferenceLists } from '../Models/ConferenceModels/conferenceListsModel.js';
import { ConferenceMonkey } from '../Models/ConferenceModels/conferenceMonkeyModel.js';
import { ConferenceService } from '../Models/ConferenceModels/conference_serviceModel.js';
import { WasetConference } from '../Models/ConferenceModels/wasetConferenceModel.js';


const fetchAllConferences = async (req, res) => {
  try {
    const [conference365Data, conferenceListsData, conferenceMonkeyData, conferenceServiceData, wasetConferenceData] = await Promise.all([
      Conference365.find({}),     
      ConferenceLists.find({}),   
      ConferenceMonkey.find({}),  
      ConferenceService.find({}), 
      WasetConference.find({})    
    ]);

    // Store the fetched data in one variable (as an array of objects)
    const allConferenceData = {
      conference365: conference365Data,
      conferenceLists: conferenceListsData,
      conferenceMonkey: conferenceMonkeyData,
      conferenceService: conferenceServiceData,
      wasetConference: wasetConferenceData
    };

    res.status(200).json(allConferenceData);
  } catch (error) {
    console.error('Error fetching data from conferences:', error);
    res.status(500).json({ message: 'Error fetching data from one or more collections.' });
  }
};

export  {fetchAllConferences};
