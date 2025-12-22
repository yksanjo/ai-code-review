import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

const CODE_EXTENSIONS = [
  '.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.c', '.cs',
  '.go', '.rs', '.rb', '.php', '.swift', '.kt', '.scala', '.r',
  '.m', '.mm', '.vue', '.svelte', '.html', '.css', '.scss', '.less'
];

export async function findFiles(
  inputs: string[],
  ignorePatterns: string[] = []
): Promise<string[]> {
  const files: Set<string> = new Set();

  for (const input of inputs) {
    try {
      const resolvedPath = path.resolve(input);
      
      if (!fs.existsSync(resolvedPath)) {
        console.warn(`Warning: Path does not exist: ${input}`);
        continue;
      }

      const stat = fs.statSync(resolvedPath);

      if (stat.isFile()) {
        if (isCodeFile(resolvedPath)) {
          files.add(resolvedPath);
        }
      } else if (stat.isDirectory()) {
        // Find all code files in directory
        const pattern = path.join(resolvedPath, '**', '*');
        try {
          const foundFiles = await glob(pattern, {
            ignore: ignorePatterns,
            nodir: true
          });

          foundFiles.forEach(file => {
            if (isCodeFile(file)) {
              files.add(path.resolve(file));
            }
          });
        } catch (globError) {
          console.warn(`Warning: Error searching directory ${input}:`, globError);
        }
      }
    } catch (error) {
      console.warn(`Warning: Error processing ${input}:`, error);
      continue;
    }
  }

  return Array.from(files);
}

function isCodeFile(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();
  return CODE_EXTENSIONS.includes(ext);
}

