/**
 * @file Definition.jsx
 * @description Блочный компонент для определения и объяснения ключевого термина.
 * Используется для словарных статей и терминологических пояснений.
 */

/**
 * Definition - блочный компонент для определения термина
 * @param {Object} props
 * @param {string} props.term - Термин для определения (e.g., "Агапэ", "Кеносис", "Эмуна")
 * @param {string} [props.original] - Оригинальное написание (опционально, e.g., "ἀγάπη", "אֱמוּנָה")
 * @param {JSX.Element} props.children - Текст определения
 * @example
 * <Definition term="Кеносис" original="κένωσις">
 *   Богословский термин, означающий "самоуничижение" или "истощание"
 *   Христа при Его воплощении, как описано в Послании к Филиппийцам 2:7.
 * </Definition>
 */
export function Definition(props) {
  return (
    <div
      class="definition"
      data-term={props.term}
      data-original={props.original}
      style={{
        'margin': '1.5em 0',
        'padding': '1.25em 1.5em',
        'border': '2px solid var(--accent-blue, #5fa8d3)',
        'border-radius': '8px',
        'background-color': 'rgba(95, 168, 211, 0.05)',
        'font-family': 'inherit',
      }}
    >
      <div
        style={{
          'font-weight': '700',
          'font-size': '1.1em',
          'color': 'var(--accent-blue, #5fa8d3)',
          'margin-bottom': '0.5em',
          'display': 'flex',
          'align-items': 'baseline',
          'gap': '0.5em',
        }}
      >
        <span>{props.term}</span>
        {props.original && (
          <span
            style={{
              'font-size': '0.9em',
              'font-weight': '500',
              'color': 'var(--accent-green, #66cc99)',
              'font-style': 'italic',
            }}
          >
            ({props.original})
          </span>
        )}
      </div>
      <div
        style={{
          'line-height': '1.6',
          'color': 'var(--text-primary, #d4d9d0)',
        }}
      >
        {props.children}
      </div>
    </div>
  );
}
