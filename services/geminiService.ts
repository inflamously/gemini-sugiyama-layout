import { GoogleGenAI, Type } from "@google/genai";
import { GraphNodeData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateGraphData = async (prompt: string): Promise<GraphNodeData[]> => {
  try {
    const model = 'gemini-2.5-flash'; 
    
    const response = await ai.models.generateContent({
      model: model,
      contents: `Create a directed acyclic graph (DAG) dataset representing: "${prompt}".
      Return a JSON array where each object has "id", "parentIds" (array of strings), "label", "type" (one of 'default', 'process', 'decision', 'output'), and a short "details" string.
      Ensure the graph is acyclic. Limit to 10-20 nodes for clarity.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              parentIds: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              },
              label: { type: Type.STRING },
              type: { type: Type.STRING, enum: ['default', 'process', 'decision', 'output'] },
              details: { type: Type.STRING }
            },
            required: ['id', 'parentIds', 'label', 'type']
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as GraphNodeData[];
    }
    return [];
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Failed to generate graph data.");
  }
};
