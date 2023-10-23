import { Message } from "../Model/messageSchema.js";

export const fetchInitialMessages = async (req, res) => {
  try {
    const messages = await Message.find(); // Fetch messages from the database
    res.status(200).json({ messages }); // Send the messages as a JSON response
  } catch (error) {
    console.error('Error fetching initial messages', error);
    res.status(500).json({ error: 'Failed to fetch initial messages' });
  }
};
