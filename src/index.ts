#!/usr/bin/env node

import { Command } from 'commander';
import { reviewCode } from './reviewer';
import { loadConfig } from './config';
import { findFiles } from './fileFinder';
import chalk from 'chalk';

const program = new Command();

program
  .name('ai-review')
  .description('AI-powered CLI tool for code review')
  .version('1.0.0')
  .argument('[files...]', 'Files or directories to review')
  .option('-c, --config <path>', 'Path to config file', '.ai-reviewrc')
  .option('-o, --output <format>', 'Output format (text, json)', 'text')
  .option('--api-key <key>', 'API key for AI provider')
  .option('--model <model>', 'AI model to use')
  .action(async (files: string[], options) => {
    try {
      const config = await loadConfig(options.config);
      
      // Override config with CLI options
      if (options.apiKey) {
        config.apiKey = options.apiKey;
      }
      if (options.model) {
        config.model = options.model;
      }

      // Validate API key
      if (!config.apiKey) {
        console.error(chalk.red('Error: API key is required.'));
        console.error(chalk.yellow('Set OPENAI_API_KEY environment variable or use --api-key option.'));
        process.exit(1);
      }

      // Find files to review
      const filesToReview = files.length > 0 
        ? await findFiles(files, config.ignorePatterns || [])
        : await findFiles(['.'], config.ignorePatterns || []);

      if (filesToReview.length === 0) {
        console.error(chalk.yellow('No files found to review.'));
        process.exit(0);
      }

      console.log(chalk.blue(`Reviewing ${filesToReview.length} file(s)...\n`));

      // Review each file
      const results = [];
      for (const file of filesToReview) {
        try {
          const result = await reviewCode(file, config);
          results.push({ file, ...result });
          
          if (options.output === 'json') {
            // JSON output will be printed at the end
            continue;
          }
          
          // Print text output
          printReviewResult(file, result);
        } catch (error) {
          console.error(chalk.red(`Error reviewing ${file}:`), error);
          results.push({ file, error: String(error) });
        }
      }

      // Print JSON output if requested
      if (options.output === 'json') {
        console.log(JSON.stringify(results, null, 2));
      }

    } catch (error) {
      console.error(chalk.red('Fatal error:'), error);
      process.exit(1);
    }
  });

program.parse();

function printReviewResult(file: string, result: any) {
  console.log(chalk.bold.underline(`\n📄 ${file}\n`));
  
  if (result.summary) {
    console.log(chalk.cyan('Summary:'), result.summary);
    console.log();
  }

  if (result.issues && result.issues.length > 0) {
    result.issues.forEach((issue: any) => {
      const severityColor = 
        issue.severity === 'error' ? chalk.red :
        issue.severity === 'warning' ? chalk.yellow :
        chalk.blue;
      
      const icon = 
        issue.severity === 'error' ? '❌' :
        issue.severity === 'warning' ? '⚠️' :
        '💡';
      
      console.log(`${severityColor(icon)} [${issue.severity.toUpperCase()}] ${issue.message}`);
      
      if (issue.line) {
        console.log(chalk.gray(`   Line ${issue.line}: ${issue.code || ''}`));
      }
      
      if (issue.suggestion) {
        console.log(chalk.green(`   💡 Suggestion: ${issue.suggestion}`));
      }
      
      console.log();
    });
  } else {
    console.log(chalk.green('✅ No issues found!\n'));
  }
  
  console.log(chalk.gray('─'.repeat(60)));
}

