import * as fs from 'fs';
import OpenAI from 'openai';
import { ReviewConfig } from './config';

export interface ReviewIssue {
  severity: 'error' | 'warning' | 'suggestion';
  message: string;
  line?: number;
  code?: string;
  suggestion?: string;
}

export interface ReviewResult {
  summary: string;
  issues: ReviewIssue[];
  score?: number;
}

export async function reviewCode(
  filePath: string,
  config: ReviewConfig
): Promise<ReviewResult> {
  const code = fs.readFileSync(filePath, 'utf-8');
  const fileName = filePath.split('/').pop() || filePath;

  if (!config.apiKey) {
    throw new Error('API key is required');
  }

  const openai = new OpenAI({
    apiKey: config.apiKey,
  });

  const prompt = createReviewPrompt(code, fileName, config);

  try {
    // Validate code length
    if (code.length > 50000) {
      throw new Error('File is too large. Maximum size is 50,000 characters.');
    }

    const response = await openai.chat.completions.create({
      model: config.model || 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an expert code reviewer. Analyze code and provide actionable feedback. Return your response as JSON with the following structure: { "summary": "brief summary", "score": 0-100, "issues": [{"severity": "error|warning|suggestion", "message": "description", "line": number, "code": "code snippet", "suggestion": "fix suggestion"}] }'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: config.temperature || 0.3,
      max_tokens: config.maxTokens || 2000,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    let result;
    try {
      result = JSON.parse(content);
    } catch (parseError) {
      throw new Error(`Failed to parse AI response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
    }
    
    // Validate and normalize the result
    return {
      summary: result.summary || 'Code review completed',
      score: result.score,
      issues: Array.isArray(result.issues) 
        ? result.issues.map(normalizeIssue)
        : []
    };
  } catch (error) {
    if (error instanceof Error) {
      // Handle specific OpenAI API errors
      if (error.message.includes('API key')) {
        throw new Error('Invalid API key. Please check your OPENAI_API_KEY environment variable.');
      }
      if (error.message.includes('rate limit')) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      if (error.message.includes('insufficient_quota')) {
        throw new Error('Insufficient API quota. Please check your OpenAI account.');
      }
      throw new Error(`AI review failed: ${error.message}`);
    }
    throw new Error('Unknown error during AI review');
  }
}

function createReviewPrompt(code: string, fileName: string, config: ReviewConfig): string {
  const language = detectLanguage(fileName);
  
  return `Please review the following ${language} code file: ${fileName}

Code:
\`\`\`${language}
${code}
\`\`\`

Review criteria:
1. Identify bugs, errors, and potential runtime issues
2. Check for security vulnerabilities
3. Suggest performance improvements
4. Review code style and best practices
5. Check for code smells and anti-patterns
6. Verify proper error handling
7. Check for proper documentation

${config.includeSuggestions ? 'Include specific suggestions for each issue.' : ''}

Return your analysis as JSON with the structure specified in the system message.`;
}

function detectLanguage(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  const languageMap: Record<string, string> = {
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'py': 'python',
    'java': 'java',
    'cpp': 'cpp',
    'c': 'c',
    'cs': 'csharp',
    'go': 'go',
    'rs': 'rust',
    'rb': 'ruby',
    'php': 'php',
    'swift': 'swift',
    'kt': 'kotlin',
    'scala': 'scala',
    'r': 'r',
    'vue': 'vue',
    'html': 'html',
    'css': 'css',
    'scss': 'scss',
    'less': 'less'
  };
  return languageMap[ext] || 'text';
}

function normalizeIssue(issue: any): ReviewIssue {
  const severity = ['error', 'warning', 'suggestion'].includes(issue.severity)
    ? issue.severity
    : 'suggestion';

  return {
    severity: severity as 'error' | 'warning' | 'suggestion',
    message: issue.message || 'No description',
    line: issue.line ? parseInt(issue.line) : undefined,
    code: issue.code,
    suggestion: issue.suggestion
  };
}

