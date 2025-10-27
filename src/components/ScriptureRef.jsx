/**
 * @file ScriptureRef.jsx
 * @description Inline-ссылка на стих Писания (в отличие от BibleVerse, который показывает полную цитату).
 * Используется для упоминаний стихов в тексте.
 */

/**
 * ScriptureRef - inline компонент для ссылки на стих
 * @param {Object} props
 * @param {string} props.book - Книга Писания (e.g., "Быт", "Иоанн", "Рим")
 * @param {string|number} props.chapter - Глава
 * @param {string|number} props.verse - Стих или диапазон (e.g., "16", "16-18")
 * @param {string} [props.translation] - Перевод (опционально, e.g., "Синод.", "LXX")
 * @param {JSX.Element} [props.children] - Кастомный текст (если не указан, генерируется автоматически)
 * @example
 * <ScriptureRef book="Быт" chapter="15" verse="6" />
 * // Отображается как: Быт 15:6
 *
 * <ScriptureRef book="Иоанн" chapter="1" verse="1">в начале Евангелия от Иоанна</ScriptureRef>
 */
export function ScriptureRef(props) {
  // Генерируем стандартный формат ссылки
  const defaultText = `${props.book} ${props.chapter}:${props.verse}`;
  const displayText = props.children || defaultText;

  // Полная ссылка для title
  const fullRef = props.translation
    ? `${defaultText} (${props.translation})`
    : defaultText;

  const handleClick = (e) => {
    e.preventDefault();

    // Диспатчим событие для показа текста стиха (можно реализовать позже)
    const event = new CustomEvent('showScripture', {
      detail: {
        book: props.book,
        chapter: props.chapter,
        verse: props.verse,
        translation: props.translation,
      },
      bubbles: true,
    });
    e.target.dispatchEvent(event);
  };

  return (
    <span
      class="scripture-ref"
      data-book={props.book}
      data-chapter={props.chapter}
      data-verse={props.verse}
      data-translation={props.translation}
      title={fullRef}
      onClick={handleClick}
      style={{
        'color': 'var(--accent-green, #66cc99)',
        'cursor': 'pointer',
        'font-weight': '600',
        'font-family': 'inherit',
        'white-space': 'nowrap',
        'border-bottom': '1px solid var(--accent-green, #66cc99)',
        'text-decoration': 'none',
        'transition': 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderBottom = '2px solid var(--accent-green, #66cc99)';
        e.currentTarget.style.color = 'var(--text-primary, #d4d9d0)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderBottom = '1px solid var(--accent-green, #66cc99)';
        e.currentTarget.style.color = 'var(--accent-green, #66cc99)';
      }}
    >
      {displayText}
    </span>
  );
}
