import axios from "axios";

export async function getAIRecommendation(prompt) {
  try {
    const response = await axios.post("http://localhost:5000/api/ai-recommend", { prompt });
    return response.data.result;
  } catch (error) {
    console.error("Error sending message: ", {
      message: error.message,
      status: error.response?.status,
      body: error.response?.data,
    });
    return null;
  }
}