/**
 * Prebuild checks for detecting syntax errors in React files
 * This script runs before the main build process to catch potential issues
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function checkTypeScriptErrors() {
  console.log('Checking for TypeScript errors...');
  
  try {
    const { stdout, stderr } = await execAsync('npx tsc --noEmit');
    
    if (stderr) {
      console.error('TypeScript check found errors:');
      console.error(stderr);
      return false;
    }
    
    console.log('TypeScript check passed.');
    return true;
  } catch (error: any) {
    console.error('TypeScript check failed:');
    console.error(error.stderr || error.message);
    return false;
  }
}

async function checkReactSyntax() {
  console.log('Checking React files for syntax errors...');
  
  try {
    // Use ESLint to check for React syntax errors
    // This requires eslint to be installed with appropriate React plugins
    const { stdout, stderr } = await execAsync(
      'npx eslint --ext .ts,.tsx client/src --quiet --max-warnings=0', 
      { cwd: rootDir }
    );
    
    if (stderr) {
      console.warn('ESLint check produced warnings:');
      console.warn(stderr);
    }
    
    if (stdout) {
      console.error('ESLint found errors:');
      console.error(stdout);
      return false;
    }
    
    console.log('React syntax check passed.');
    return true;
  } catch (error: any) {
    // If ESLint isn't set up, we'll do a basic check for unclosed JSX tags
    console.warn('Could not run ESLint, falling back to basic checks.');
    console.warn(error.message);
    
    // Perform a basic check for common syntax errors
    return await performBasicSyntaxCheck();
  }
}

async function performBasicSyntaxCheck() {
  const clientDir = path.join(rootDir, 'client', 'src');
  const reactFiles: string[] = [];
  
  // Find all React component files
  function findReactFiles(dir: string) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        findReactFiles(filePath);
      } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
        reactFiles.push(filePath);
      }
    }
  }
  
  try {
    findReactFiles(clientDir);
    
    // Check each file for basic syntax issues
    for (const file of reactFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      
      // Very basic check for unbalanced opening/closing brackets
      const openingTags = (content.match(/<[^/][^>]*>/g) || []).length;
      const closingTags = (content.match(/<\/[^>]*>/g) || []).length;
      
      if (openingTags !== closingTags) {
        console.error(`Potential syntax error in ${file}: unbalanced JSX tags`);
        console.error(`Found ${openingTags} opening tags and ${closingTags} closing tags`);
        return false;
      }
      
      // Check for unmatched curly braces, parentheses, and brackets
      const braceCount = countCharacters(content, '{', '}');
      const parenCount = countCharacters(content, '(', ')');
      const bracketCount = countCharacters(content, '[', ']');
      
      if (braceCount !== 0 || parenCount !== 0 || bracketCount !== 0) {
        console.error(`Potential syntax error in ${file}: unbalanced characters`);
        if (braceCount !== 0) console.error(`Unbalanced curly braces: ${braceCount}`);
        if (parenCount !== 0) console.error(`Unbalanced parentheses: ${parenCount}`);
        if (bracketCount !== 0) console.error(`Unbalanced brackets: ${bracketCount}`);
        return false;
      }
    }
    
    console.log(`Basic syntax check passed for ${reactFiles.length} React files.`);
    return true;
  } catch (error) {
    console.error('Error during basic syntax check:', error);
    return false;
  }
}

function countCharacters(content: string, opening: string, closing: string): number {
  const openCount = (content.match(new RegExp(`\\${opening}`, 'g')) || []).length;
  const closeCount = (content.match(new RegExp(`\\${closing}`, 'g')) || []).length;
  return openCount - closeCount;
}

// Run all checks
async function runChecks() {
  const tsCheck = await checkTypeScriptErrors();
  const reactCheck = await checkReactSyntax();
  
  return tsCheck && reactCheck;
}

// Execute and export
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runChecks().then(success => {
    if (!success) {
      console.error('Prebuild checks failed. Please fix the issues before building.');
      process.exit(1);
    }
    console.log('All prebuild checks passed successfully!');
  });
}

export { runChecks }; 