import { GrantForward } from "../Models/GrantsModels/grantForwardModel.js";
import { UkriGrants } from "../Models/GrantsModels/ukri.js";


const fetchAllGrants = async (req, res) => {
    try {
      const [GrantForwardData, UkriGrantsData] = await Promise.all([
        GrantForward.find({}),     
        UkriGrants.find({}),   
      ]);
  
      // Store the fetched data in one variable (as an array of objects)
      const allGrantsData = {
        grantForward: GrantForwardData,
        ukriGrants: UkriGrantsData,
  
      };
  
      res.status(200).json(allGrantsData);
    } catch (error) {
      console.error('Error fetching data from conferences:', error);
      res.status(500).json({ message: 'Error fetching data from one or more collections.' });
    }
  };
  
  export  {fetchAllGrants};