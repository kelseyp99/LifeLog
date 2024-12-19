import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('Error: OPENAI_API_KEY is not set.');
  process.exit(1);
}

interface ActivityInput {
  categories: string[]; // List of categories
  description: string;  // Activity description
}

interface ParsedActivity {
  category: string;     // The category returned by OpenAI
  parsedDescription: string; // Parsed activity or additional structured info
}

export const analyzeActivity = async (input: ActivityInput): Promise<ParsedActivity> => {
  const url = 'https://api.openai.com/v1/chat/completions';

  const { categories, description } = input;

  try {
    console.log(`Debug: Sending request to OpenAI API with categories and description.`);
    console.log(`Categories: ${categories.join(', ')}`);
    console.log(`Description: "${description}"`);

    // Prompt setup with categories and user activity
    const systemPrompt = `
      You are a data parsing assistant. You will analyze activities and assign them to a relevant category. 
      The list of categories is: ${categories.join(', ')}. 

      For each activity description provided, return a JSON object with:
      - "category": The most relevant category from the list
      - "parsedDescription": A concise, clear explanation of the activity
    `;

    const userPrompt = `Here is the activity description: "${description}". 
    Please analyze and categorize this activity.`;

    const response = await axios.post(
      url,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
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

    console.log('Debug: API response:', response.data);

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      const responseText = response.data.choices[0].message.content;
      console.log('Debug: Parsed response:', responseText);

      // Parse the response JSON returned from OpenAI
      const result: ParsedActivity = JSON.parse(responseText);
      console.log('Debug: Final Parsed Result:', result);

      return result;
    } else {
      console.warn('Debug: No valid response from OpenAI.');
      return { category: 'Uncategorized', parsedDescription: 'Unable to parse activity.' };
    }
  } catch (error) {
    console.error('Error during OpenAI API call:', error);
    throw error;
  }
};
