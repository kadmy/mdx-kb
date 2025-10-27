/**
 * @file Rebuttal.jsx
 * @description Структурный компонент для ответа на CounterArgument.
 * Представляет опровержение противоположной позиции с аргументацией.
 */

/**
 * Rebuttal - структурный компонент для опровержения
 * @param {Object} props
 * @param {string} props.summary - Краткий итог опровержения (required)
 * @param {JSX.Element} props.children - Содержимое: детальное опровержение с доказательствами
 * @example
 * <Rebuttal summary="Никейский Собор (325 г.) утвердил 'единосущие'">
 *   Ответом Церкви стал <EventRef eventKey="council_nicaea_325">Первый Никейский собор</EventRef>.
 *   Ключевым стало слово <Term term="homoousios">единосущный</Term> (греч. ὁμοούσιος),
 *   означающее, что Сын имеет ту же сущность, что и Отец.
 * </Rebuttal>
 */
export function Rebuttal(props) {
  return (
    <div
      class="rebuttal"
      data-summary={props.summary}
      style={{
        'margin': '1.25em 0',
        'padding': '1em 1.25em',
        'border-left': '4px solid var(--accent-blue, #5fa8d3)',
        'background-color': 'rgba(95, 168, 211, 0.06)',
        'border-radius': '4px',
        'font-family': 'inherit',
      }}
    >
      {/* Заголовок опровержения */}
      <div
        style={{
          'font-weight': '700',
          'font-size': '1.05em',
          'color': 'var(--accent-blue, #5fa8d3)',
          'margin-bottom': '0.75em',
          'display': 'flex',
          'align-items': 'center',
          'gap': '0.5em',
        }}
      >
        <span style={{ 'font-size': '1.2em' }}>⟳</span>
        <span>{props.summary}</span>
      </div>

      {/* Содержимое опровержения */}
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
