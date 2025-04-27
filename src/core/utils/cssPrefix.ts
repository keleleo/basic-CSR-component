export function cssPrefix(prefix: string, css: string): string {
  return css.replace(/(^|\})([^{\}]+)\{/g, (match, brace, selector) => {
    const scoped = selector
      .split(',')
      .map((s: string) =>
        /^root\b/.test(s.trim()) ? s.trim() : `${prefix} ${s.trim()}`
      )
      .join(', ')
      .replace(/\broot\b/g, prefix);
    return `${brace}\n${scoped}{`;
  });
}
