/**
 * @file SupportPoint.jsx
 * @description Структурный компонент для представления одного конкретного довода,
 * доказательства или примера в поддержку тезиса ArgumentSection.
 */

/**
 * SupportPoint - структурный компонент для довода
 * @param {Object} props
 * @param {string} props.title - Краткое название этого довода (required)
 * @param {JSX.Element} props.children - Содержимое: текст, цитаты, примеры
 * @example
 * <SupportPoint title="Часть 1: Обетования (Дар Всевышнего)">
 *   Всевышний инициирует завет, давая три великих обетования...
 *   <BibleVerse book="Берешит" chapter="12" verse="1-3">...</BibleVerse>
 * </SupportPoint>
 */
export function SupportPoint(props) {
  return (
    <div
      class="support-point"
      data-title={props.title}
      style={{
        'margin': '1.25em 0',
        'padding': '1em 1.25em',
        'border-left': '4px solid var(--accent-green, #66cc99)',
        'background-color': 'rgba(102, 204, 153, 0.06)',
        'border-radius': '4px',
        'font-family': 'inherit',
      }}
    >
      {/* Заголовок довода */}
      <div
        style={{
          'font-weight': '700',
          'font-size': '1.05em',
          'color': 'var(--accent-green, #66cc99)',
          'margin-bottom': '0.75em',
          'display': 'flex',
          'align-items': 'center',
          'gap': '0.5em',
        }}
      >
        <span style={{ 'font-size': '1.2em' }}>✓</span>
        <span>{props.title}</span>
      </div>

      {/* Содержимое довода */}
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
