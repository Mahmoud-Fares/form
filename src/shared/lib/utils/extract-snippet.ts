/**
 * Extracts the portion of source code between marker comments.
 * Falls back to the full source if no markers are found.
 *
 * Usage in your component file:
 *   // demo-start
 *   <Controller ... />
 *   // demo-end
 */
export function extractSnippet(
   source: string,
   startMarker = '// demo-start',
   endMarker = '// demo-end'
): string {
   const startIndex = source.indexOf(startMarker);
   const endIndex = source.indexOf(endMarker);

   if (startIndex === -1 || endIndex === -1) {
      return source.trim();
   }

   const snippet = source.slice(startIndex + startMarker.length, endIndex);

   return dedent(snippet);
}

/**
 * Removes the common leading whitespace from every line,
 * so extracted snippets aren't over-indented. Blank lines at the
 * very start/end are dropped first WITHOUT touching the indentation
 * of the remaining lines (a plain .trim() would do that and break
 * the indent calculation).
 */
function dedent(code: string): string {
   const lines = code.split('\n');

   // Drop leading/trailing blank lines, keep internal indentation intact
   while (lines.length && lines[0].trim() === '') lines.shift();
   while (lines.length && lines[lines.length - 1].trim() === '') lines.pop();

   const indents = lines
      .filter((line) => line.trim().length > 0)
      .map((line) => /^\s*/.exec(line)?.[0].length ?? 0);

   const minIndent = indents.length ? Math.min(...indents) : 0;

   return lines.map((line) => line.slice(minIndent)).join('\n');
}
