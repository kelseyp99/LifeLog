import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('Error: OPENAI_API_KEY is not set.');
  process.exit(1);
}

export const sendMealDescription = async (description: string) => {
  const url = 'https://api.openai.com/v1/chat/completions';

  try {
    console.log(`Debug: Sending request to OpenAI API with description: "${description}"`); // Debug: Log input description

    const response = await axios.post(
      url,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a nutritional expert.' },
          { role: 'user', content: `Can you analyze this meal: "${description}"?` },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    console.log('Debug: API response:', response.data); // Debug: Log the raw response

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      const analysis = response.data.choices[0].message.content;
      console.log('Debug: Analysis received:', analysis); // Debug: Log the analysis result
      return analysis;
    } else {
      console.warn('Debug: No analysis available in response.'); // Debug: Warn about missing data
      return 'No analysis available.';
    }
  } catch (error) {
    console.error('Error during API call:', error || error); // Debug: Log detailed error
    throw error;
  }
};
