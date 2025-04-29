import { db, FieldValue } from '../../firebase.js';

const unsaveItem = async (req, res) => {
  try {
    const { userId, itemId, itemType } = req.body;

    const userRef = db.collection('user_profile').doc(userId);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return res.status(404).json({ message: 'User not found' });
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
      [fieldName]: FieldValue.arrayRemove(itemId),
    });

    res.status(200).json({ message: 'Item unsaved successfully' });
  } catch (error) {
    console.error('Error unsaving item:', error);
    res.status(500).json({ message: 'Error unsaving item' });
  }
};

export { unsaveItem };
