/**
 * @file BibleVerse.jsx
 * @description Блочный компонент для форматированной цитаты из Священного Писания.
 * В отличие от ScriptureRef (inline-ссылка), BibleVerse показывает полный текст цитаты.
 */

/**
 * BibleVerse - блочный компонент для цитат из Писания
 * @param {Object} props
 * @param {string} props.book - Название книги (e.g., "Бытие", "Римлянам", "Иоанн")
 * @param {string|number} props.chapter - Глава
 * @param {string|number} props.verse - Стих или диапазон (e.g., "16", "16-18")
 * @param {string} [props.translation] - Перевод (опционально, e.g., "Синод.", "РБО", "LXX")
 * @param {JSX.Element} props.children - Текст цитаты
 * @example
 * <BibleVerse book="Ефесянам" chapter="2" verse="8-9" translation="Синод.">
 *   Ибо благодатью вы спасены через веру, и сие не от вас, Божий дар:
 *   не от дел, чтобы никто не хвалился.
 * </BibleVerse>
 */
export function BibleVerse(props) {
  const reference = `${props.book} ${props.chapter}:${props.verse}`;
  const fullReference = props.translation
    ? `${reference} (${props.translation})`
    : reference;

  return (
    <blockquote
      class="bible-verse"
      data-book={props.book}
      data-chapter={props.chapter}
      data-verse={props.verse}
      data-translation={props.translation}
      style={{
        'margin': '1.5em 0',
        'padding': '1em 1.5em',
        'border-left': '4px solid var(--accent-green, #66cc99)',
        'background-color': 'rgba(102, 204, 153, 0.05)',
        'font-family': 'inherit',
        'font-style': 'italic',
        'color': 'var(--text-primary, #d4d9d0)',
        'position': 'relative',
      }}
    >
      <div
        style={{
          'margin-bottom': '0.5em',
          'line-height': '1.6',
        }}
      >
        {props.children}
      </div>
      <cite
        style={{
          'display': 'block',
          'margin-top': '0.75em',
          'font-style': 'normal',
          'font-size': '0.9em',
          'color': 'var(--accent-green, #66cc99)',
          'font-weight': '600',
          'text-align': 'right',
        }}
      >
        — {fullReference}
      </cite>
    </blockquote>
  );
}
