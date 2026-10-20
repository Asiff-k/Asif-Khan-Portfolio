/**
 * Inline head script: marks the page as running JavaScript (html.js) before
 * first paint, so client-only views can replace their plain fallbacks without
 * leaving visitors who have JavaScript off an empty box.
 */
export const jsFlagScript = `document.documentElement.classList.add("js")`;
