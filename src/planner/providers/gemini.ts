import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { AIProvider, AIProviderType, GeminiConfig, AIServiceError, APIKeyMissingError } from '../interfaces';

/**
 * Gemini AI provider implementation
 */
export class GeminiProvider implements AIProvider {
  public readonly name = 'Google Gemini';
  public readonly type: AIProviderType = 'gemini';
  
  private genAI: GoogleGenerativeAI | null = null;
  private config: GeminiConfig;

  constructor(config: GeminiConfig) {
    this.config = config;
    
    if (config.apiKey && config.apiKey.trim() !== '' && config.apiKey !== 'your_api_key_here') {
      this.genAI = new GoogleGenerativeAI(config.apiKey);
      console.log('GeminiProvider: GoogleGenerativeAI initialized successfully');
    } else {
      console.log('GeminiProvider: API key invalid or placeholder, not initializing AI');
    }
  }

  async generatePlan(prompt: string, options?: any): Promise<string> {
    if (!this.genAI) {
      throw new APIKeyMissingError('gemini');
    }

    try {
      const model = this.genAI.getGenerativeModel({ 
        model: this.config.model || 'gemini-pro',
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
        ],
      });
      
      const systemPrompt = `Create a concise project plan in JSON format for: "${prompt}"

Return ONLY valid JSON. No extra text. Keep file structure simple (max 2 levels deep).

{
  "title": "Project Title",
  "overview": "Brief description (1-2 sentences)",
  "requirements": ["requirement 1", "requirement 2", "requirement 3"],
  "fileStructure": [
    {
      "name": "src",
      "type": "directory", 
      "path": "src/",
      "description": "Source code"
    },
    {
      "name": "package.json",
      "type": "file", 
      "path": "package.json",
      "description": "Dependencies"
    }
  ],
  "nextSteps": [
    {
      "id": "step1",
      "description": "Setup project",
      "completed": false,
      "priority": "high",
      "estimatedTime": "30 minutes",
      "dependencies": []
    }
  ]
}`;

      const result = await model.generateContent(systemPrompt);
      const response = await result.response;
      
      console.log('GeminiProvider: Response candidates:', response.candidates?.length || 0);
      console.log('GeminiProvider: Finish reason:', response.candidates?.[0]?.finishReason);
      
      const text = response.text();
      console.log('GeminiProvider: Raw AI response length:', text.length);

      if (!text || text.trim() === '') {
        throw new AIServiceError('Empty response from Gemini API');
      }

      return text;
    } catch (error) {
      console.error('GeminiProvider: Error generating plan:', error);
      if (error instanceof APIKeyMissingError) {
        throw error;
      }
      throw new AIServiceError(
        `Failed to generate plan with Gemini: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const testAI = new GoogleGenerativeAI(apiKey);
      const model = testAI.getGenerativeModel({ model: 'gemini-pro' });
      await model.generateContent("Hello");
      return true;
    } catch (error) {
      console.error('GeminiProvider: API key validation failed:', error);
      return false;
    }
  }

  getSupportedModels(): string[] {
    return ['gemini-pro', 'gemini-pro-vision'];
  }

  async isAvailable(): Promise<boolean> {
    return this.genAI !== null && this.config.apiKey.trim() !== '';
  }
}