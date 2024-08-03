import { API_KEY } from './secrets';

async function getGPTResponse(text) {
  const systemMessage = {
    role: "system",
    content: "Extract the shapes and only give dimension of each side based on provided prompt"
  };

  const apiMessages = [
    systemMessage,
    { role: "user", content: text }
  ];

  const apiRequestBody = {
    model: "gpt-3.5-turbo",
    messages: apiMessages
  };

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error processing message to ChatGPT:", error);
    throw error;
  }
}

export default getGPTResponse;