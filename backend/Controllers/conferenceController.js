import express from 'express';
import { Conference365 } from '../Models/ConferenceModels/conference365Model.js';
import { ConferenceLists } from '../Models/ConferenceModels/conferenceListsModel.js';
import { ConferenceService } from '../Models/ConferenceModels/conference_serviceModel.js';
import { WasetConference } from '../Models/ConferenceModels/wasetConferenceModel.js';

const fetchAllConferences = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const searchQuery = req.query.search || '';
    const locationFilter = req.query.location || ''; 

    const startDateFilter = req.query.startDate ? new Date(req.query.startDate) : null;
    const endDateFilter = req.query.endDate ? new Date(req.query.endDate) : null;

    const searchFilter = {};

    if (searchQuery) {
      searchFilter.$or = [
        { title: { $regex: searchQuery, $options: 'i' } },
        { location: { $regex: searchQuery, $options: 'i' } },
      ];
    }

    if (locationFilter) {
      searchFilter.location = { $regex: locationFilter, $options: 'i' };
    }

    const [conference365Data, conferenceListsData, conferenceServiceData, wasetConferenceData] = await Promise.all([
      Conference365.find(searchFilter),
      ConferenceLists.find(searchFilter),
      ConferenceService.find(searchFilter),
      WasetConference.find(searchFilter),
    ]);

    const parseConferenceDate = (dateString) => {
      if (!dateString) return null;
      const rangePattern = /(\d{1,2}\s\w+\s\d{4})\s*-\s*(\d{1,2}\s\w+\s\d{4})/;
      const singleDatePattern = /(\d{1,2}\s\w+\s\d{4})/;
      const wasetPattern = /\((\w+\s\d{1,2}-\d{1,2},\s\d{4})\)/;

      let startDate, endDate;

      if (rangePattern.test(dateString)) {
        const [, start, end] = dateString.match(rangePattern);
        startDate = new Date(start);
        endDate = new Date(end);
      } else if (wasetPattern.test(dateString)) {
        const [, date] = dateString.match(wasetPattern);
        const [month, dayRange, year] = date.replace(",", "").split(" ");
        const [startDay, endDay] = dayRange.split("-");
        startDate = new Date(`${month} ${startDay}, ${year}`);
        endDate = new Date(`${month} ${endDay}, ${year}`);
      } else if (singleDatePattern.test(dateString)) {
        const [date] = dateString.match(singleDatePattern);
        startDate = new Date(date);
        endDate = new Date(date);
      } else {
        return null;
      }

      return { startDate, endDate };
    };

    const filteredConferences = [
      ...conference365Data,
      ...conferenceServiceData,
      ...conferenceListsData,
      ...wasetConferenceData,
    ]
      .map((conf) => {
        const dateField = conf.dates || conf.date;
        const parsedDates = parseConferenceDate(dateField);

        if (!parsedDates) return null;
        conf.startDate = parsedDates.startDate;
        conf.endDate = parsedDates.endDate;
        return conf;
      })
      .filter(Boolean)
      .filter((conf) => {
        if (!conf.startDate || !conf.endDate) return false;
        if (startDateFilter && conf.endDate < startDateFilter) return false;
        if (endDateFilter && conf.startDate > endDateFilter) return false;
        return true;
      });

    filteredConferences.sort((a, b) => a.startDate - b.startDate);

    const paginatedConferences = filteredConferences.slice(skip, skip + limit);

    res.status(200).json({
      conferences: paginatedConferences,
      total: filteredConferences.length,
      page,
      limit,
    });
  } catch (error) {
    console.error('Error fetching conferences:', error);
    res.status(500).json({ message: 'Error fetching data from one or more collections.' });
  }
};




export { fetchAllConferences };