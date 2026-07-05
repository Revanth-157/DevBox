import '@testing-library/jest-dom/vitest';
import * as React from 'react';
import Prism from 'prismjs';

// Make React available globally for tests that compile to classic JSX
(globalThis as any).React = React;

// Ensure Prism.languages exists and has common language placeholders
(globalThis as any).Prism = Prism;
const prismWithLanguages = Prism as typeof Prism & { languages: Record<string, any> };
prismWithLanguages.languages = prismWithLanguages.languages || {};
const _langs = ['clike','javascript','typescript','python','java','go','rust','cpp','sql','markup','css'];
_langs.forEach((l) => {
	if (!prismWithLanguages.languages[l]) prismWithLanguages.languages[l] = {} as any;
});
