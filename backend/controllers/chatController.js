import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const generateAIResponse = async (req, res) => {
  const { message } = req.body;
  const apiKey = process.env.GOOGLE_API_KEY || 'fallback_value';
  console.log('API Key:', apiKey === 'fallback_value' ? 'Using fallback' : 'Using env variable');
  console.log('API Key length:', apiKey.length);
  console.log('API Key first 5 characters:', apiKey.substring(0, 5));

  console.log('GOOGLE_API_KEY:', process.env.GOOGLE_API_KEY ? 'Is set' : 'Is not set');

  if (!apiKey || apiKey === 'fallback_value') {
    console.error('GOOGLE_API_KEY is not set or invalid');
    return res.status(500).json({ error: 'Server configuration error: GOOGLE_API_KEY is not set or invalid' });
  }

  try {
    console.log('Sending request to Google API...');
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
      {
        contents: [{ parts: [{ text: message }] }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          key: apiKey,
        },
      }
    );

    console.log('Received response from Google API');
    const aiResponse = response.data.candidates[0].content.parts[0].text || 'No response from the AI';
    res.json({ response: aiResponse });
  } catch (error) {
    console.error('Error calling Google API:', error.response ? error.response.data : error.message);
    if (error.response) {
      res.status(500).json({ 
        error: 'Error fetching AI response', 
        details: error.response.data,
        status: error.response.status
      });
    } else if (error.request) {
      res.status(500).json({ 
        error: 'No response received from Google API', 
        details: error.message
      });
    } else {
      res.status(500).json({ 
        error: 'Error setting up the request', 
        details: error.message
      });
    }
  }
};