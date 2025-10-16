import { AIProvider, AIProviderType, OpenAIConfig, AIServiceError, APIKeyMissingError } from '../interfaces';
import fetch from 'node-fetch';

/**
 * OpenAI provider implementation
 */
export class OpenAIProvider implements AIProvider {
  public readonly name = 'OpenAI';
  public readonly type: AIProviderType = 'openai';
  
  private config: OpenAIConfig;
  private baseUrl = 'https://api.openai.com/v1';

  constructor(config: OpenAIConfig) {
    this.config = config;
  }

  async generatePlan(prompt: string, options?: any): Promise<string> {
    if (!this.config.apiKey || this.config.apiKey.trim() === '') {
      throw new APIKeyMissingError('openai');
    }

    try {
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

      const requestBody = {
        model: this.config.model || 'gpt-4',
        messages: [
          {
            role: 'user',
            content: systemPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
        top_p: 0.95
      };

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      };

      if (this.config.organization) {
        headers['OpenAI-Organization'] = this.config.organization;
      }

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json() as any;
        throw new AIServiceError(
          `OpenAI API error: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`
        );
      }

      const data = await response.json() as any;
      const text = data.choices?.[0]?.message?.content;

      if (!text || text.trim() === '') {
        throw new AIServiceError('Empty response from OpenAI API');
      }

      console.log('OpenAIProvider: Raw AI response length:', text.length);
      return text;
    } catch (error) {
      console.error('OpenAIProvider: Error generating plan:', error);
      if (error instanceof APIKeyMissingError || error instanceof AIServiceError) {
        throw error;
      }
      throw new AIServiceError(
        `Failed to generate plan with OpenAI: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
      return response.ok;
    } catch (error) {
      console.error('OpenAIProvider: API key validation failed:', error);
      return false;
    }
  }

  getSupportedModels(): string[] {
    return ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'];
  }

  async isAvailable(): Promise<boolean> {
    return !!(this.config.apiKey && this.config.apiKey.trim() !== '');
  }
}