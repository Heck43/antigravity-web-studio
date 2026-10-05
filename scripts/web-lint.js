#!/usr/bin/env node

/**
 * Pre-release Quality Linter for Web Studio Projects
 * Inspired by universal-modder's publish check.
 * Usage: node scripts/web-lint.js <path-to-app-folder>
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const targetDir = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();

console.log(`\n🔍 [Pre-Release Lint] Inspecting: ${path.relative(process.cwd(), targetDir) || '.'}\n`);

let passed = 0;
let failed = 0;

function report(condition, desc) {
  if (condition) {
    console.log(`  ✅ PASS: ${desc}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${desc}`);
    failed++;
  }
}

// 1. Entry point check
const indexHtmlPath = path.join(targetDir, 'index.html');
const hasIndex = fs.existsSync(indexHtmlPath);
report(hasIndex, 'Main entry point index.html exists');

if (hasIndex) {
  const html = fs.readFileSync(indexHtmlPath, 'utf-8');
  report(html.includes('<!DOCTYPE html>') || html.includes('<!doctype html>'), 'Valid HTML5 doctype declaration');
  report(html.includes('viewport'), 'Responsive viewport meta tag present');
  report(/<title>.+<\/title>/i.test(html), 'Page title tag present and non-empty');
}

// 2. CSS Check
const cssFiles = [];
function findFiles(dir, ext) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let results = [];
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results = results.concat(findFiles(full, ext));
    else if (entry.name.endsWith(ext)) results.push(full);
  }
  return results;
}

const allCss = findFiles(targetDir, '.css');
if (allCss.length > 0) {
  let cssBalanced = true;
  for (const file of allCss) {
    const content = fs.readFileSync(file, 'utf-8');
    const opens = (content.match(/\{/g) || []).length;
    const closes = (content.match(/\}/g) || []).length;
    if (opens !== closes) {
      cssBalanced = false;
      console.error(`     Brace mismatch in ${path.relative(targetDir, file)}: ${opens} { vs ${closes} }`);
    }
  }
  report(cssBalanced, `CSS balanced braces check (${allCss.length} CSS files inspected)`);
}

// 3. JavaScript Syntax Check
const allJs = findFiles(targetDir, '.js');
if (allJs.length > 0) {
  let jsSyntaxOk = true;
  for (const file of allJs) {
    try {
      execSync(`node -c "${file}"`, { stdio: 'pipe' });
    } catch (err) {
      jsSyntaxOk = false;
      console.error(`     Syntax error in ${path.relative(targetDir, file)}: ${err.message}`);
    }
  }
  report(jsSyntaxOk, `JavaScript syntax check via node -c (${allJs.length} JS files inspected)`);
}

// 4. Hygiene & Secrets Scan
let hygieneOk = true;
const forbiddenPatterns = [
  { pattern: /debugger\s*;/i, name: 'debugger statement' },
  { pattern: /(AKIA[0-9A-Z]{16})/i, name: 'AWS Access Key' },
  { pattern: /(ghp_[0-9a-zA-Z]{36})/i, name: 'GitHub Personal Token' }
];

const textFiles = [...findFiles(targetDir, '.js'), ...findFiles(targetDir, '.html'), ...findFiles(targetDir, '.css')];
for (const file of textFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  for (const { pattern, name } of forbiddenPatterns) {
    if (pattern.test(content)) {
      hygieneOk = false;
      console.error(`     Found ${name} in ${path.relative(targetDir, file)}`);
    }
  }
}
report(hygieneOk, 'Hygiene and secret scan passed (no leaked tokens or debug statements)');

console.log(`\n📊 Result: ${passed} passed, ${failed} failed.\n`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 Project is clean and ready for release!\n');
  process.exit(0);
}
