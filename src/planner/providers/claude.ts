import { AIProvider, AIProviderType, ClaudeConfig, AIServiceError, APIKeyMissingError } from '../interfaces';
import fetch from 'node-fetch';

/**
 * Claude AI provider implementation
 */
export class ClaudeProvider implements AIProvider {
  public readonly name = 'Anthropic Claude';
  public readonly type: AIProviderType = 'claude';
  
  private config: ClaudeConfig;
  private baseUrl = 'https://api.anthropic.com/v1';

  constructor(config: ClaudeConfig) {
    this.config = config;
  }

  async generatePlan(prompt: string, options?: any): Promise<string> {
    if (!this.config.apiKey || this.config.apiKey.trim() === '') {
      throw new APIKeyMissingError('claude');
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
        model: this.config.model || 'claude-3-sonnet-20240229',
        max_tokens: 4000,
        temperature: 0.7,
        messages: [
          {
            role: 'user',
            content: systemPrompt
          }
        ]
      };

      const response = await fetch(`${this.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.config.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json() as any;
        throw new AIServiceError(
          `Claude API error: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`
        );
      }

      const data = await response.json() as any;
      const text = data.content?.[0]?.text;

      if (!text || text.trim() === '') {
        throw new AIServiceError('Empty response from Claude API');
      }

      console.log('ClaudeProvider: Raw AI response length:', text.length);
      return text;
    } catch (error) {
      console.error('ClaudeProvider: Error generating plan:', error);
      if (error instanceof APIKeyMissingError || error instanceof AIServiceError) {
        throw error;
      }
      throw new AIServiceError(
        `Failed to generate plan with Claude: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      // Claude doesn't have a simple validation endpoint, so we'll try a minimal request
      const response = await fetch(`${this.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 10,
          messages: [{ role: 'user', content: 'Hi' }]
        })
      });
      return response.ok;
    } catch (error) {
      console.error('ClaudeProvider: API key validation failed:', error);
      return false;
    }
  }

  getSupportedModels(): string[] {
    return ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'];
  }

  async isAvailable(): Promise<boolean> {
    return !!(this.config.apiKey && this.config.apiKey.trim() !== '');
  }
}