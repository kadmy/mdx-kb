/**
 * @file Synthesis.jsx
 * @description Структурный компонент для заключительного блока внутри ArgumentSection.
 * Подводит итог и связывает все SupportPoint воедино, формируя целостное заключение.
 */

/**
 * Synthesis - структурный компонент для синтеза/заключения
 * @param {Object} props
 * @param {JSX.Element} props.children - Содержимое: итоговое заключение, связывающее все доводы
 * @example
 * <Synthesis>
 *   Таким образом, Никейский Символ веры стал синтезом апостольского
 *   учения (Иоанн 1:1) и точной философской терминологии (ὁμοούσιος),
 *   вынужденной арианским спором.
 * </Synthesis>
 */
export function Synthesis(props) {
  return (
    <div
      class="synthesis"
      style={{
        'margin': '1.5em 0 0 0',
        'padding': '1.25em 1.5em',
        'border': '2px solid var(--accent-yellow, #f4a261)',
        'border-radius': '8px',
        'background': 'linear-gradient(135deg, rgba(244, 162, 97, 0.1) 0%, rgba(244, 162, 97, 0.03) 100%)',
        'font-family': 'inherit',
        'position': 'relative',
      }}
    >
      {/* Иконка и метка */}
      <div
        style={{
          'position': 'absolute',
          'top': '-0.75em',
          'left': '1em',
          'background-color': 'var(--bg-primary, #1a1e23)',
          'padding': '0 0.75em',
          'font-weight': '700',
          'font-size': '0.9em',
          'color': 'var(--accent-yellow, #f4a261)',
          'text-transform': 'uppercase',
          'letter-spacing': '0.05em',
        }}
      >
        <span style={{ 'margin-right': '0.35em' }}>◈</span>
        Синтез
      </div>

      {/* Содержимое синтеза */}
      <div
        style={{
          'line-height': '1.7',
          'color': 'var(--text-primary, #d4d9d0)',
          'font-style': 'italic',
          'margin-top': '0.5em',
        }}
      >
        {props.children}
      </div>
    </div>
  );
}
