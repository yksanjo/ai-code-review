# AI Code Review Assistant

A powerful CLI tool that uses AI to review your code, suggest improvements, and catch bugs before you create a pull request. Built for developers who want to improve code quality without the overhead of complex SaaS tools.

> 📚 **See [PRODUCTS.md](./PRODUCTS.md) for a complete catalog of all AI developer tools with detailed descriptions and UX/UI mockups.**

> 🎨 **View interactive HTML mockups in the [mockups/](./mockups/) directory. Open `mockups/index.html` in your browser to see all visual designs.**

## Features

- 🤖 **AI-Powered Reviews**: Uses GPT-4 to analyze your code for bugs, security issues, and improvements
- ⚡ **Fast & Simple**: Just run `ai-review path/to/file.js` - no complex setup
- 🎯 **Actionable Suggestions**: Get specific, line-by-line feedback with code suggestions
- 🔧 **Configurable**: Customize review criteria, severity levels, and AI model
- 📁 **Multi-file Support**: Review entire directories or specific files
- 🎨 **Beautiful Output**: Color-coded, easy-to-read results

## Installation

### From npm (when published)
```bash
npm install -g ai-code-review
```

### From source
```bash
git clone <your-repo-url>
cd ai-code-review
npm install
npm run build
npm link  # Makes 'ai-review' available globally
```

## Quick Start

1. **Set your API key:**
   ```bash
   export OPENAI_API_KEY="your-api-key-here"
   ```

2. **Review a file:**
   ```bash
   ai-review src/index.ts
   ```

3. **Review a directory:**
   ```bash
   ai-review src/
   ```

4. **Review current directory:**
   ```bash
   ai-review
   ```

## Configuration

Create a `.ai-reviewrc` file in your project root:

```json
{
  "apiProvider": "openai",
  "model": "gpt-4-turbo-preview",
  "maxTokens": 2000,
  "temperature": 0.3,
  "includeSuggestions": true,
  "severityLevels": ["error", "warning", "suggestion"],
  "ignorePatterns": [
    "node_modules/**",
    "dist/**",
    "build/**"
  ]
}
```

### Environment Variables

- `OPENAI_API_KEY` - Your OpenAI API key (required)
- `API_PROVIDER` - API provider: "openai" or "anthropic" (default: "openai")
- `AI_MODEL` - Model to use (default: "gpt-4-turbo-preview")

## Usage Examples

### Basic Usage
```bash
# Review a single file
ai-review src/utils.ts

# Review multiple files
ai-review src/file1.ts src/file2.ts

# Review entire directory
ai-review src/

# Review current directory
ai-review
```

### Advanced Options
```bash
# Use custom config file
ai-review --config .myconfig.json src/

# Output as JSON
ai-review --output json src/

# Override API key
ai-review --api-key sk-... src/

# Use different model
ai-review --model gpt-3.5-turbo src/
```

## Output Format

### Text Output (Default)
```
📄 src/utils.ts

Summary: Code is generally well-structured but has a few potential issues.

❌ [ERROR] Potential null pointer exception on line 15
   Line 15: const result = data.value.toString();
   💡 Suggestion: Add null check: const result = data?.value?.toString() || '';

⚠️ [WARNING] Function is too long (50+ lines)
   Line 1: function processData() {
   💡 Suggestion: Consider breaking into smaller functions

💡 [SUGGESTION] Missing JSDoc comment
   Line 1: export function processData() {
   💡 Suggestion: Add function documentation
```

### JSON Output
```bash
ai-review --output json src/utils.ts
```

Returns structured JSON for integration with other tools.

## Supported Languages

- JavaScript/TypeScript (.js, .jsx, .ts, .tsx)
- Python (.py)
- Java (.java)
- C/C++ (.c, .cpp)
- Go (.go)
- Rust (.rs)
- Ruby (.rb)
- PHP (.php)
- And more...

## What Gets Reviewed?

- 🐛 **Bugs & Errors**: Potential runtime errors, null pointer exceptions, etc.
- 🔒 **Security**: Vulnerabilities, unsafe patterns, injection risks
- ⚡ **Performance**: Inefficient algorithms, memory leaks, optimization opportunities
- 📝 **Code Style**: Best practices, consistency, readability
- 🏗️ **Architecture**: Code smells, anti-patterns, design issues
- 🛡️ **Error Handling**: Missing try-catch, unhandled promises, etc.
- 📚 **Documentation**: Missing comments, unclear function names

## Requirements

- Node.js >= 18.0.0
- OpenAI API key (or Anthropic API key)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Author

Yoshi Kondo - Building production-grade enterprise tools with AI

---

**Note**: This tool uses AI APIs which may incur costs. Review pricing for your chosen provider.

