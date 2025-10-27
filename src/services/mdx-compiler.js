import { compile, evaluate } from '@mdx-js/mdx';
import * as runtime from 'solid-js/h/jsx-runtime';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';

/**
 * Компилирует MDX контент в исполняемый компонент SolidJS
 * @param {string} mdxContent - MDX контент для компиляции
 * @param {Object} components - MDX компоненты для использования
 * @returns {Promise<{Component: Function, error: null} | {Component: null, error: Error}>}
 */
export async function compileMDX(mdxContent, components = {}) {
  try {
    console.log('Compiling MDX with components:', Object.keys(components));

    // Создаем функцию useMDXComponents
    const useMDXComponents = () => components;

    // Компилируем и выполняем MDX код
    const { default: Content, frontmatter } = await evaluate(mdxContent, {
      // Опции компиляции
      remarkPlugins: [remarkGfm, remarkFrontmatter],
      development: false,
      // Runtime для SolidJS
      Fragment: runtime.Fragment,
      jsx: runtime.jsx,
      jsxs: runtime.jsxs,
      jsxDEV: runtime.jsxDEV,
      // useMDXComponents
      useMDXComponents,
      // Компоненты напрямую
      Concept: components.Concept,
      Term: components.Term,
      Glossary: components.Glossary,
      concept: components.concept,
      term: components.term,
    });

    console.log('MDX compiled successfully');

    return {
      Component: Content,
      frontmatter,
      error: null
    };
  } catch (error) {
    console.error('MDX compilation error:', error);
    return {
      Component: null,
      frontmatter: null,
      error: {
        message: error.message,
        line: error.line,
        column: error.column,
        position: error.position
      }
    };
  }
}

/**
 * Валидирует MDX синтаксис без полной компиляции
 * @param {string} mdxContent
 * @returns {Promise<{valid: boolean, errors: Array}>}
 */
export async function validateMDXSyntax(mdxContent) {
  try {
    await compile(mdxContent, {
      remarkPlugins: [remarkGfm, remarkFrontmatter],
      development: false
    });
    return { valid: true, errors: [] };
  } catch (error) {
    return {
      valid: false,
      errors: [{
        message: error.message,
        line: error.line,
        column: error.column
      }]
    };
  }
}