#!/usr/bin/env node
/**
 * to-docx.js — Converts AEM EDS .plain.html draft files to .docx Word
 * documents ready for import into Google Docs as AEM-authored content.
 *
 * Block divs (e.g. <div class="sidebar-cta">) are converted to Google-Docs-
 * style tables where the first row contains the block name and subsequent
 * rows hold the block content — matching the expected AEM authoring format.
 *
 * Requires: pandoc (brew install pandoc)
 *
 * Usage:
 *   node scripts/to-docx.js                          # all drafts/*.plain.html
 *   node scripts/to-docx.js drafts/page.plain.html   # single file
 */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { basename, join } from 'node:path';
import { tmpdir } from 'node:os';

const DRAFTS = 'drafts';

function toTitleCase(str) {
  return str
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/**
 * Returns the index of the </div> that closes the opening <div> whose
 * inner content begins at `from`. Correctly handles arbitrarily nested divs.
 * Returns -1 if no matching close tag is found.
 */
function findClosingDiv(html, from) {
  let depth = 1;
  let i = from;
  while (i < html.length && depth > 0) {
    const nextOpen = html.indexOf('<div', i);
    const nextClose = html.indexOf('</div>', i);
    if (nextClose === -1) return -1;
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth += 1;
      i = nextOpen + 4;
    } else {
      depth -= 1;
      if (depth === 0) return nextClose;
      i = nextClose + 6;
    }
  }
  return -1;
}

/**
 * Parses the direct child plain <div> (no attributes) elements within `html`.
 * Returns an array of { inner } objects containing each child's inner HTML.
 */
function parseChildDivs(html) {
  const children = [];
  let i = 0;
  while (i < html.length) {
    const openIdx = html.indexOf('<div>', i);
    if (openIdx === -1) break;
    const innerStart = openIdx + 5;
    const closeIdx = findClosingDiv(html, innerStart);
    if (closeIdx === -1) break;
    children.push({ inner: html.slice(innerStart, closeIdx) });
    i = closeIdx + 6;
  }
  return children;
}

/**
 * Converts AEM block divs to HTML tables.
 *
 * Block pattern:
 *   <div class="block-name">   ← block (single lowercase-kebab class)
 *     <div>                    ← row
 *       <div>cell content</div>  ← cell
 *     </div>
 *   </div>
 *
 * Output table pattern (matches Google Docs authoring format):
 *   ┌─────────────────────┐
 *   │     Block Name      │  ← header row (block name, spans all cols)
 *   ├──────────┬──────────┤
 *   │  cell 1  │  cell 2  │  ← content rows
 *   └──────────┴──────────┘
 */
function convertBlocksToTables(html) {
  // Match divs with a single block-style class (e.g. class="sidebar-cta")
  const blockRe = /<div class="([a-z][a-z0-9]*(?:-[a-z0-9]+)*)">/g;

  // Collect all matches first, then process in reverse so that index
  // positions remain valid after each substitution.
  const matches = [...html.matchAll(blockRe)].reverse();

  let result = html;

  matches.forEach((match) => {
    const blockName = match[1];
    const innerStart = match.index + match[0].length;
    const closeIdx = findClosingDiv(result, innerStart);
    if (closeIdx === -1) return;

    const inner = result.slice(innerStart, closeIdx);
    const blockEnd = closeIdx + 6;

    // Parse rows (direct child plain <div>s of the block)
    const rows = parseChildDivs(inner);
    if (rows.length === 0) return;

    // For each row, parse its cells (direct child plain <div>s of the row)
    const tableRows = rows.map(({ inner: rowInner }) => {
      const cells = parseChildDivs(rowInner);
      // If no cell divs found, treat the whole row content as one cell
      return cells.length === 0
        ? [rowInner.trim()]
        : cells.map(({ inner: c }) => c.trim());
    });

    const colCount = Math.max(...tableRows.map((r) => r.length));
    const headerRow = `<tr><th colspan="${colCount}">${toTitleCase(blockName)}</th></tr>`;
    const bodyRows = tableRows.map(
      (cells) => `<tr>${cells.map((c) => `<td>${c || '&nbsp;'}</td>`).join('')}</tr>`,
    );

    const table = `<table border="1">${headerRow}${bodyRows.join('')}</table>`;
    result = result.slice(0, match.index) + table + result.slice(blockEnd);
  });

  return result;
}

// ── main ────────────────────────────────────────────────────────────────────

const allDrafts = readdirSync(DRAFTS)
  .filter((f) => f.endsWith('.plain.html'))
  .map((f) => join(DRAFTS, f));

const files = process.argv[2] ? [process.argv[2]] : allDrafts;

if (files.length === 0) {
  process.stderr.write(`No .plain.html files found in ${DRAFTS}/\n`);
  process.exit(1);
}

const tmp = join(tmpdir(), 'aem-draft-pandoc-input.html');

files.forEach((file) => {
  const raw = readFileSync(file, 'utf8');
  const processed = convertBlocksToTables(raw);
  const fullHtml = [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '<head><meta charset="utf-8"></head>',
    '<body>',
    processed,
    '</body></html>',
  ].join('\n');

  writeFileSync(tmp, fullHtml, 'utf8');

  const name = basename(file).replace(/\.plain\.html$/, '').replace(/\.html$/, '');
  const outPath = join(DRAFTS, `${name}.docx`);

  execSync(`pandoc "${tmp}" -f html -t docx -o "${outPath}"`);
  process.stdout.write(`✓ ${outPath}\n`);
});
