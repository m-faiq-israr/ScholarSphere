import { db, FieldValue } from '../../firebase.js';

const saveItem = async (req, res) => {
  try {
    const { userId, itemId, itemType } = req.body;

    const userRef = db.collection('user_profile').doc(userId);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      await userRef.set({
        savedGrants: [],
        savedConferences: [],
        savedJournals: [],
      });
    }

    const fieldMap = {
      grant: 'savedGrants',
      conference: 'savedConferences',
      journal: 'savedJournals',
    };

    const fieldName = fieldMap[itemType];
    if (!fieldName) {
      return res.status(400).json({ message: 'Invalid item type' });
    }

    await userRef.update({
      [fieldName]: FieldValue.arrayUnion(itemId),
    });

    res.status(200).json({ message: 'Item saved successfully' });
  } catch (error) {
    console.error('Error saving item:', error);
    res.status(500).json({ message: 'Error saving item' });
  }
};

export {saveItem};
