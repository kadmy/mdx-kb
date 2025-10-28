/**
 * @file monaco-completions.js
 * @description Monaco Editor автодополнение для MDX компонентов
 */

/**
 * Регистрирует completion provider для MDX компонентов
 * @param {*} monaco - Monaco editor instance
 */
export function registerMDXCompletions(monaco) {
  // Регистрируем для markdown (так как MDX — это расширение Markdown)
  monaco.languages.registerCompletionItemProvider('markdown', {
    triggerCharacters: ['<', ' '],

    provideCompletionItems: (model, position) => {
      const textUntilPosition = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      });

      // Проверяем, находимся ли мы внутри JSX тега
      const match = textUntilPosition.match(/<(\w*)$/);
      if (!match) {
        return { suggestions: [] };
      }

      const suggestions = [
        // === Inline компоненты ===
        {
          label: 'OriginalWord',
          kind: monaco.languages.CompletionItemKind.Class,
          insertText: 'OriginalWord lang="${1:hebrew}" translit="${2:transliteration}">$3</OriginalWord>$0',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Слово на языке оригинала (иврит/греческий) с транслитерацией',
          detail: 'Inline: иврит/греческий текст',
        },
        {
          label: 'PersonRef',
          kind: monaco.languages.CompletionItemKind.Class,
          insertText: 'PersonRef personKey="${1:person_id}">$2</PersonRef>$0',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Кликабельная ссылка на историческую персону',
          detail: 'Inline: ссылка на персону',
        },
        {
          label: 'ScriptureRef',
          kind: monaco.languages.CompletionItemKind.Class,
          insertText: 'ScriptureRef book="${1:Быт}" chapter="${2:1}" verse="${3:1}" />$0',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Inline-ссылка на стих Писания',
          detail: 'Inline: ссылка на стих',
        },
        {
          label: 'PlaceRef',
          kind: monaco.languages.CompletionItemKind.Class,
          insertText: 'PlaceRef placeKey="${1:place_id}">$2</PlaceRef>$0',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Ссылка на географическое место',
          detail: 'Inline: место',
        },
        {
          label: 'SourceRef',
          kind: monaco.languages.CompletionItemKind.Class,
          insertText: 'SourceRef title="${1:Название источника}">$2</SourceRef>$0',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Ссылка на древний источник (не Библию)',
          detail: 'Inline: древний источник',
        },

        // === Блочные компоненты ===
        {
          label: 'BibleVerse',
          kind: monaco.languages.CompletionItemKind.Class,
          insertText: 'BibleVerse book="${1:Книга}" chapter="${2:1}" verse="${3:1}" translation="${4:Синод.}">\n  $5\n</BibleVerse>$0',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Форматированная цитата из Писания',
          detail: 'Блок: цитата из Писания',
        },
        {
          label: 'Definition',
          kind: monaco.languages.CompletionItemKind.Class,
          insertText: 'Definition term="${1:Термин}" original="${2:оригинал}">\n  $3\n</Definition>$0',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Определение ключевого термина',
          detail: 'Блок: определение',
        },
        {
          label: 'Callout',
          kind: monaco.languages.CompletionItemKind.Class,
          insertText: 'Callout type="${1|info,warning,doctrine,interpretation,danger|}" title="${2:Заголовок}">\n  $3\n</Callout>$0',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Выделенный блок для привлечения внимания',
          detail: 'Блок: заметка/предупреждение',
        },
        {
          label: 'JewishContext',
          kind: monaco.languages.CompletionItemKind.Class,
          insertText: 'JewishContext title="${1:Заголовок}">\n  $2\n</JewishContext>$0',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Еврейский культурный контекст',
          detail: 'Блок: еврейский контекст',
        },
        {
          label: 'Ritual',
          kind: monaco.languages.CompletionItemKind.Class,
          insertText: 'Ritual id="${1:ritual_id}" title="${2:Название ритуала}">\n  $3\n</Ritual>$0',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Описание еврейского ритуала',
          detail: 'Блок: ритуал',
        },

        // === Структурные компоненты ===
        {
          label: 'ArgumentSection',
          kind: monaco.languages.CompletionItemKind.Class,
          insertText: 'ArgumentSection thesis="${1:Главный тезис раздела}">\n\n  <SupportPoint title="${2:Название довода}">\n    $3\n  </SupportPoint>\n\n</ArgumentSection>$0',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Раздел аргументации с тезисом',
          detail: 'Структура: раздел аргументации',
        },
        {
          label: 'SupportPoint',
          kind: monaco.languages.CompletionItemKind.Class,
          insertText: 'SupportPoint title="${1:Название довода}">\n  $2\n</SupportPoint>$0',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Довод в поддержку тезиса',
          detail: 'Структура: довод',
        },
        {
          label: 'CounterArgument',
          kind: monaco.languages.CompletionItemKind.Class,
          insertText: 'CounterArgument title="${1:Контртезис}">\n  $2\n</CounterArgument>$0',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Контраргумент, противоположная позиция',
          detail: 'Структура: контраргумент',
        },
        {
          label: 'Rebuttal',
          kind: monaco.languages.CompletionItemKind.Class,
          insertText: 'Rebuttal summary="${1:Краткий итог опровержения}">\n  $2\n</Rebuttal>$0',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Опровержение контраргумента',
          detail: 'Структура: опровержение',
        },
        {
          label: 'Synthesis',
          kind: monaco.languages.CompletionItemKind.Class,
          insertText: 'Synthesis>\n  $1\n</Synthesis>$0',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Заключительный синтез аргументации',
          detail: 'Структура: синтез',
        },

        // === Управление знаниями ===
        {
          label: 'KnowledgeFragment',
          kind: monaco.languages.CompletionItemKind.Class,
          insertText: 'KnowledgeFragment concept="${1:concept_id}" aspect="${2|etymological,definition,application,problem,polemic,comparative,interpretation,historical,theological|}">\n  $3\n</KnowledgeFragment>$0',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Маркировка фрагмента знания для RAG-системы',
          detail: 'RAG: фрагмент знания',
        },

        // === Существующие компоненты ===
        {
          label: 'Concept',
          kind: monaco.languages.CompletionItemKind.Class,
          insertText: 'Concept id="${1:concept-id}">$2</Concept>$0',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Маркировка концепции для глоссария',
          detail: 'Существующий: концепция',
        },
        {
          label: 'Term',
          kind: monaco.languages.CompletionItemKind.Class,
          insertText: 'Term term="${1:термин}">$2</Term>$0',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Ссылка на термин в глоссарии',
          detail: 'Существующий: термин',
        },
      ];

      return { suggestions };
    },
  });

  console.log('✓ MDX completions registered');
}
