import * as fs from 'fs';
import * as path from 'path';

export interface ReviewConfig {
  apiProvider?: 'openai' | 'anthropic';
  apiKey?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  language?: string;
  includeSuggestions?: boolean;
  severityLevels?: string[];
  ignorePatterns?: string[];
}

const defaultConfig: ReviewConfig = {
  apiProvider: 'openai',
  model: 'gpt-4-turbo-preview',
  maxTokens: 2000,
  temperature: 0.3,
  language: 'en',
  includeSuggestions: true,
  severityLevels: ['error', 'warning', 'suggestion'],
  ignorePatterns: [
    'node_modules/**',
    'dist/**',
    'build/**',
    '*.min.js',
    '*.min.css'
  ]
};

export async function loadConfig(configPath: string): Promise<ReviewConfig> {
  const config: ReviewConfig = { ...defaultConfig };

  // Load from environment variables
  config.apiKey = process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY;
  config.apiProvider = process.env.API_PROVIDER as 'openai' | 'anthropic' || 'openai';
  config.model = process.env.AI_MODEL || config.model;

  // Load from config file
  const fullPath = path.resolve(configPath);
  if (fs.existsSync(fullPath)) {
    try {
      const fileContent = fs.readFileSync(fullPath, 'utf-8');
      const fileConfig = JSON.parse(fileContent);
      Object.assign(config, fileConfig);
    } catch (error) {
      console.warn(`Warning: Could not parse config file ${configPath}:`, error);
    }
  }

  return config;
}

