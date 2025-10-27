/**
 * Кастомная тема Monaco Editor на основе палитры проекта Cook
 * Согласована с solid-version/src/index.css
 *
 * Палитра проекта:
 * --bg-deep: #072828
 * --bg-medium: #1a3a3a
 * --bg-card: #163232
 * --accent-orange: #ff8c42
 * --accent-green: #66cc99
 * --text-primary: #d4d9d0
 * --text-secondary: #a8b5a8
 * --text-dim: #7a8a7a
 * --border-dim: #884422
 * --page-color: #ffaa66
 */

export const cookTheme = {
  base: 'vs-dark',
  inherit: false, // Не наследуем встроенные цвета!
  rules: [
    // === БАЗОВЫЕ ТОКЕНЫ ===
    // Комментарии - text-dim (приглушенные)
    { token: 'comment', foreground: '7a8a7a', fontStyle: 'italic' },
    { token: 'comment.block', foreground: '7a8a7a', fontStyle: 'italic' },
    { token: 'comment.line', foreground: '7a8a7a', fontStyle: 'italic' },

    // Строки - accent-green
    { token: 'string', foreground: '66cc99' },
    { token: 'string.quoted', foreground: '66cc99' },
    { token: 'string.template', foreground: '66cc99' },

    // Числа - page-color
    { token: 'number', foreground: 'ffaa66' },
    { token: 'number.hex', foreground: 'ffaa66' },
    { token: 'constant.numeric', foreground: 'ffaa66' },

    // Константы и булевы - page-color
    { token: 'constant', foreground: 'ffaa66' },
    { token: 'constant.language', foreground: 'ffaa66' },

    // Переменные и идентификаторы - text-primary
    { token: 'variable', foreground: 'd4d9d0' },
    { token: 'identifier', foreground: 'd4d9d0' },

    // Функции - text-primary
    { token: 'entity.name.function', foreground: 'd4d9d0' },
    { token: 'support.function', foreground: 'd4d9d0' },

    // Операторы и делимитеры - text-secondary
    { token: 'keyword.operator', foreground: 'a8b5a8' },
    { token: 'punctuation', foreground: 'a8b5a8' },
    { token: 'delimiter', foreground: 'a8b5a8' },
    { token: 'delimiter.bracket', foreground: 'a8b5a8' },

    // === КЛЮЧЕВЫЕ СЛОВА ===
    // import, export, const, let и т.д. - accent-orange
    { token: 'keyword', foreground: 'ff8c42' },
    { token: 'storage', foreground: 'ff8c42' },
    { token: 'storage.type', foreground: 'ff8c42' },
    { token: 'keyword.control', foreground: 'ff8c42' },

    // === JSX/MDX СПЕЦИФИКА (БАЗОВЫЕ ПРАВИЛА - ИДУТ ПЕРВЫМИ) ===
    // Теги компонентов - accent-orange (ярко-оранжевый)
    { token: 'tag', foreground: 'ff8c42' },
    { token: 'entity.name.tag', foreground: 'ff8c42' },
    { token: 'meta.tag', foreground: 'ff8c42' },

    // Атрибуты компонентов - text-secondary
    { token: 'entity.other.attribute-name', foreground: 'a8b5a8' },
    { token: 'attribute.name', foreground: 'a8b5a8' },

    // Значения атрибутов - accent-green (как строки)
    { token: 'attribute.value', foreground: '66cc99' },

    // Скобки тегов <> - text-secondary
    { token: 'punctuation.definition.tag', foreground: 'a8b5a8' },

    // === MARKDOWN БАЗОВЫЕ СТИЛИ ===
    // Жирный текст ** ** - text-primary, жирный
    { token: 'strong', foreground: 'd4d9d0', fontStyle: 'bold' },
    { token: 'markup.bold', foreground: 'd4d9d0', fontStyle: 'bold' },

    // Курсив * * - text-primary, курсив
    { token: 'emphasis', foreground: 'd4d9d0', fontStyle: 'italic' },
    { token: 'markup.italic', foreground: 'd4d9d0', fontStyle: 'italic' },

    // Ссылки и URLs - accent-green
    { token: 'string.link', foreground: '66cc99' },
    { token: 'markup.underline.link', foreground: '66cc99' },

    // Списки - text-dim
    { token: 'list.md', foreground: '7a8a7a' },
    { token: 'markup.list', foreground: '7a8a7a' },
    { token: 'beginning.punctuation.definition.list.markdown', foreground: '7a8a7a' },

    // Code blocks - text-secondary
    { token: 'markup.inline.raw', foreground: 'a8b5a8' },
    { token: 'markup.fenced_code', foreground: 'a8b5a8' },

    // === MARKDOWN ЗАГОЛОВКИ (В САМОМ КОНЦЕ - МАКСИМАЛЬНЫЙ ПРИОРИТЕТ) ===
    // Заголовки markdown (# ## ###) - красноватый цвет для контраста с MDX тегами
    { token: 'keyword.md', foreground: 'e53a50', fontStyle: '' },
  ],
  colors: {
    // === ОСНОВНЫЕ ЦВЕТА РЕДАКТОРА ===
    'editor.background': '#072828',          // bg-deep
    'editor.foreground': '#d4d9d0',          // text-primary

    // Подсветка текущей строки
    'editor.lineHighlightBackground': '#0a3030',
    'editor.lineHighlightBorder': '#0a3030',

    // Выделение текста
    'editor.selectionBackground': '#ff8c4240',      // accent-orange с прозрачностью
    'editor.inactiveSelectionBackground': '#1a3a3a',
    'editor.selectionHighlightBackground': '#ff8c4220',

    // Номера строк
    'editorLineNumber.foreground': '#7a8a7a',       // text-dim
    'editorLineNumber.activeForeground': '#a8b5a8', // text-secondary

    // Курсор
    'editorCursor.foreground': '#ff8c42',           // accent-orange

    // Gutter (область с номерами строк)
    'editorGutter.background': '#072828',           // bg-deep
    'editorGutter.modifiedBackground': '#ffaa66',   // page-color
    'editorGutter.addedBackground': '#66cc99',      // accent-green
    'editorGutter.deletedBackground': '#ff8c42',    // accent-orange

    // Отступы и направляющие
    'editorIndentGuide.background': '#7a8a7a22',
    'editorIndentGuide.activeBackground': '#7a8a7a44',

    // Whitespace символы
    'editorWhitespace.foreground': '#7a8a7a33',

    // === ВИДЖЕТЫ И ПАНЕЛИ ===
    // Границы
    'editorWidget.border': '#884422',               // border-dim
    'panel.border': '#884422',

    // Автодополнение (suggest widget)
    'editorSuggestWidget.background': '#163232',    // bg-card
    'editorSuggestWidget.border': '#884422',        // border-dim
    'editorSuggestWidget.foreground': '#d4d9d0',    // text-primary
    'editorSuggestWidget.selectedBackground': '#1a3a3a', // bg-medium
    'editorSuggestWidget.highlightForeground': '#ff8c42', // accent-orange

    // Hover widget
    'editorHoverWidget.background': '#163232',      // bg-card
    'editorHoverWidget.border': '#884422',          // border-dim

    // === ПОИСК ===
    'editor.findMatchBackground': '#ff8c4266',
    'editor.findMatchHighlightBackground': '#ff8c4233',
    'editor.findRangeHighlightBackground': '#ff8c4222',

    // === СКРОЛЛБАР ===
    'scrollbar.shadow': '#00000033',
    'scrollbarSlider.background': '#1a3a3a66',      // bg-medium
    'scrollbarSlider.hoverBackground': '#1a3a3a99',
    'scrollbarSlider.activeBackground': '#1a3a3aCC',

    // === MINIMAP ===
    'minimap.background': '#072828',                // bg-deep
    'minimap.selectionHighlight': '#ff8c4266',
    'minimap.findMatchHighlight': '#ff8c4266',

    // === ДРУГИЕ ЭЛЕМЕНТЫ ===
    // Совпадающие скобки
    'editorBracketMatch.background': '#ff8c4233',
    'editorBracketMatch.border': '#ff8c42',

    // Ошибки и предупреждения
    'editorError.foreground': '#ff8c42',
    'editorWarning.foreground': '#ffaa66',
    'editorInfo.foreground': '#66cc99',

    // Область фокуса
    'focusBorder': '#ff8c42',
  }
};
