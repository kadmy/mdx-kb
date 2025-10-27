/**
 * @file SourceRef.jsx
 * @description Inline-ссылка на древний источник (не Библию): Мишна, Талмуд, раннехристианские труды и т.д.
 * Используется для разметки цитат или упоминаний древних текстов.
 */

/**
 * SourceRef - inline компонент для ссылки на древний источник
 * @param {Object} props
 * @param {string} props.title - Название труда (e.g., "Дидахе", "Иудейские древности", "Мишна")
 * @param {string} [props.authorKey] - ID автора для связи с таблицей people (опционально, e.g., "josephus_flavius")
 * @param {JSX.Element} props.children - Текст для отображения (может отличаться от title)
 * @example
 * <SourceRef title="Дидахе">"Учении двенадцати апостолов"</SourceRef>
 * <SourceRef title="Иудейские древности" authorKey="josephus_flavius">трудах Иосифа Флавия</SourceRef>
 */
export function SourceRef(props) {
  const handleClick = (e) => {
    e.preventDefault();

    // Диспатчим событие для показа информации об источнике
    const event = new CustomEvent('showSource', {
      detail: {
        title: props.title,
        authorKey: props.authorKey,
      },
      bubbles: true,
    });
    e.target.dispatchEvent(event);
  };

  const tooltipText = props.authorKey
    ? `${props.title} (автор: ${props.authorKey})`
    : props.title;

  return (
    <span
      class="source-ref"
      data-title={props.title}
      data-author-key={props.authorKey}
      title={tooltipText}
      onClick={handleClick}
      style={{
        'color': 'var(--accent-blue, #5fa8d3)',
        'cursor': 'pointer',
        'font-weight': '500',
        'font-style': 'italic',
        'font-family': 'inherit',
        'border-bottom': '1px dotted var(--accent-blue, #5fa8d3)',
        'text-decoration': 'none',
        'transition': 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderBottom = '2px dotted var(--accent-blue, #5fa8d3)';
        e.currentTarget.style.color = 'var(--text-primary, #d4d9d0)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderBottom = '1px dotted var(--accent-blue, #5fa8d3)';
        e.currentTarget.style.color = 'var(--accent-blue, #5fa8d3)';
      }}
    >
      {props.children}
    </span>
  );
}
