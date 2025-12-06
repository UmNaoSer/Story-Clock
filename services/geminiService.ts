
import { GoogleGenAI } from "@google/genai";
import { LUMINAR_ALPHABET, CATALOG_TOPICS } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Fix: Added the missing createWord function to interact with the Gemini API.
export const createWord = async (letters: string, intent: string): Promise<string> => {
  const alphabetContext = LUMINAR_ALPHABET.map(l => `- ${l.name}: ${l.meaning}`).join('\n');

  const systemInstruction = `Você é um mestre linguista cósmico, interpretando uma antiga linguagem de luz chamada Luminar.
A linguagem é composta por Fases (letras) que representam conceitos primordiais.
Sua tarefa é receber uma sequência de Fases e uma "intenção" do usuário, e então criar um significado poético e profundo para a nova "emissão" (palavra).

O alfabeto Luminar é o seguinte:
${alphabetContext}

Regras:
1.  Analise a sequência de Fases. A primeira vogal (A, E, I, O, U) geralmente define o núcleo do conceito. As consoantes modificam ou direcionam essa essência.
2.  Considere a intenção do usuário como um guia para a interpretação. Se a intenção for vazia, interprete livremente com base nas Fases.
3.  Sua resposta DEVE ser em HTML.
4.  Formate a resposta da seguinte forma:
    - Um <h1> com um título poético para a emissão.
    - Um <h2> "Análise da Emissão: [palavra]"
    - Uma lista não ordenada (<ul>) com cada Fase e sua contribuição para o significado, em negrito (<strong>). Ex: <strong>A (Origem):</strong> ...
    - Um parágrafo <p> explicando a sinergia das Fases.
    - Um parágrafo <p> com uma "Tradução Literal Simbólica" em negrito.
    - Um parágrafo <p> com uma "Tradução Poética" em negrito.
5.  Seja criativo, evocativo e místico em seu texto. A linguagem é sobre a essência do universo.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Interprete a emissão "${letters}" com a intenção de "${intent || 'nenhuma intenção específica'}".`,
      config: {
        systemInstruction,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error creating word:", error);
    if (error instanceof Error) {
      throw new Error(`Error calling Gemini API: ${error.message}`);
    }
    throw new Error("An unknown error occurred while creating the word.");
  }
};

export const analyzeYouTubeVideo = async (prompt: string, videoUrl: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Context: The user is currently watching a YouTube video with the URL: ${videoUrl}.
      
      User's Prompt: ${prompt}

      Instructions:
      1. If you have internal knowledge about this specific video (based on the URL or if the user provides the title in the prompt), analyze it directly.
      2. If you do not know the video, answer the user's prompt based on the general topic or ask for more details.
      3. Your tone should be that of a knowledgeable film critic and philosopher.
      4. Use formatting like bolding, lists, and paragraphs to make the answer readable.`,
      config: {
        systemInstruction: "You are a cinema expert, video essayist, and philosopher of the visual arts.",
      }
    });
    
    return response.text;
  } catch (error) {
    console.error("Error analyzing video:", error);
    if (error instanceof Error) {
      throw new Error(`Error calling Gemini API: ${error.message}`);
    }
    throw new Error("An unknown error occurred while analyzing the video.");
  }
};

export const searchCatalog = async (query: string): Promise<string[]> => {
  try {
    // Prepare catalog data for the model. 
    // We strictly select data to ensure the model has context without getting lost.
    const catalogContext = CATALOG_TOPICS.map(t => ({
      name: t.name,
      category: t.category,
      meaning: t.meaning,
      // Stringify the full description to give the model deep context for semantic matching
      content: JSON.stringify(t.fullDescription).slice(0, 5000) // Limit per topic to avoid token overkill, though Flash handles huge context.
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        You are the intelligent search core of a Filmmaking Knowledge Catalog.
        
        CATALOG DATA:
        ${JSON.stringify(catalogContext)}

        USER QUERY: "${query}"

        TASK:
        Identify which topics from the catalog are semantically related to the user's query.
        The user might search for concepts, feelings, techniques, or specific terms.
        Even if the exact words aren't there, find the connection (e.g., "sadness" -> "Color Temperature" or "Shot Types").
        Think about synonyms, related filmmaking concepts, and emotional contexts.
        
        OUTPUT:
        Return a JSON array of strings containing ONLY the 'name' of the matching topics.
        Order them by relevance (most relevant first).
        If nothing is relevant, return an empty array [].
        
        Example Output: ["Distância Focal", "Tipos de Plano"]
      `,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text;
    if (!text) return [];
    
    const result = JSON.parse(text);
    if (Array.isArray(result)) {
        return result as string[];
    }
    return [];

  } catch (error) {
    console.error("Error searching catalog:", error);
    return []; 
  }
};
