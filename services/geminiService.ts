
import { GoogleGenAI, Type } from "@google/genai";
import { Question } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const questionSchema = {
    type: Type.OBJECT,
    properties: {
        question: { type: Type.STRING, description: "O texto da questão." },
        options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Uma lista de 4 opções de resposta."
        },
        correctAnswerIndex: { type: Type.INTEGER, description: "O índice (0-3) da resposta correta na lista de opções." },
        explanation: { type: Type.STRING, description: "Uma explicação detalhada sobre a resposta correta, citando artigos de lei ou princípios jurídicos quando aplicável." }
    },
    required: ["question", "options", "correctAnswerIndex", "explanation"]
};


export const generateQuizQuestions = async (subject: string, topics: string[], count: number): Promise<Question[]> => {
    const prompt = `
      Você é um especialista em direito brasileiro e um preparador experiente para o exame da OAB.
      Gere ${count} questões de múltipla escolha no estilo do exame da OAB sobre a matéria de "${subject}", abordando especificamente os seguintes tópicos: ${topics.join(', ')}.
      
      Para cada questão, forneça:
      1. O enunciado da questão.
      2. Exatamente 4 opções de resposta.
      3. O índice da resposta correta (de 0 a 3).
      4. Uma explicação clara e detalhada para a resposta correta, fundamentada na legislação ou doutrina pertinente.

      Responda estritamente no formato JSON, de acordo com o schema fornecido.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: questionSchema
                }
            }
        });
        
        const jsonText = response.text.trim();
        const questions = JSON.parse(jsonText) as Question[];

        if (!Array.isArray(questions) || questions.length === 0) {
            throw new Error("A API não retornou questões válidas.");
        }
        
        return questions;

    } catch (error) {
        console.error("Erro ao gerar questões com a API Gemini:", error);
        throw new Error("Não foi possível gerar as questões. Tente novamente.");
    }
};
