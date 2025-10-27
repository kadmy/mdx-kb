/**
 * @file CounterArgument.jsx
 * @description Структурный компонент для изложения противоположной точки зрения или критики.
 * Используется для представления альтернативных мнений и спорных позиций.
 */

/**
 * CounterArgument - структурный компонент для контраргумента
 * @param {Object} props
 * @param {string} props.title - Формулировка контртезиса (required, e.g., "Позиция Ария")
 * @param {JSX.Element} props.children - Содержимое: изложение противоположной позиции
 * @example
 * <CounterArgument title="Позиция Ария: 'Было время, когда Сына не было'">
 *   <PersonRef personKey="arius">Арий</PersonRef> утверждал, что Сын (Логос)
 *   является творением, хоть и высшим. Он не вечен, как Отец.
 * </CounterArgument>
 */
export function CounterArgument(props) {
  return (
    <div
      class="counter-argument"
      data-title={props.title}
      style={{
        'margin': '1.25em 0',
        'padding': '1em 1.25em',
        'border-left': '4px solid var(--accent-red, #e76f51)',
        'background-color': 'rgba(231, 111, 81, 0.06)',
        'border-radius': '4px',
        'font-family': 'inherit',
      }}
    >
      {/* Заголовок контраргумента */}
      <div
        style={{
          'font-weight': '700',
          'font-size': '1.05em',
          'color': 'var(--accent-red, #e76f51)',
          'margin-bottom': '0.75em',
          'display': 'flex',
          'align-items': 'center',
          'gap': '0.5em',
        }}
      >
        <span style={{ 'font-size': '1.2em' }}>✗</span>
        <span>{props.title}</span>
      </div>

      {/* Содержимое контраргумента */}
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
