/**
 * @file ArgumentSection.jsx
 * @description Структурный компонент верхнего уровня для представления одного главного тезиса
 * или раздела аргументации. Является контейнером для SupportPoint, CounterArgument, Rebuttal.
 */

/**
 * ArgumentSection - структурный компонент для раздела аргументации
 * @param {Object} props
 * @param {string} props.thesis - Краткая формулировка тезиса (required)
 * @param {JSX.Element} props.children - Содержимое: SupportPoint, CounterArgument, Rebuttal, Synthesis
 * @example
 * <ArgumentSection thesis="Завет Авраама является двусторонним: обетования от Всевышнего и обязательства от человека">
 *   <SupportPoint title="Часть 1: Обетования">
 *     ...
 *   </SupportPoint>
 *   <SupportPoint title="Часть 2: Обязательства">
 *     ...
 *   </SupportPoint>
 * </ArgumentSection>
 */
export function ArgumentSection(props) {
  return (
    <section
      class="argument-section"
      data-thesis={props.thesis}
      style={{
        'margin': '2em 0',
        'padding': '1.5em',
        'border': '3px solid var(--accent-purple, #b392ac)',
        'border-radius': '10px',
        'background': 'linear-gradient(135deg, rgba(179, 146, 172, 0.08) 0%, rgba(179, 146, 172, 0.02) 100%)',
        'font-family': 'inherit',
      }}
    >
      {/* Заголовок секции с тезисом */}
      <div
        style={{
          'font-weight': '700',
          'font-size': '1.15em',
          'color': 'var(--accent-purple, #b392ac)',
          'margin-bottom': '1em',
          'padding-bottom': '0.75em',
          'border-bottom': '2px solid var(--accent-purple, #b392ac)',
          'line-height': '1.4',
        }}
      >
        <span style={{ 'margin-right': '0.5em', 'opacity': '0.7' }}>⚡</span>
        {props.thesis}
      </div>

      {/* Содержимое: SupportPoint, CounterArgument и т.д. */}
      <div
        style={{
          'color': 'var(--text-primary, #d4d9d0)',
        }}
      >
        {props.children}
      </div>
    </section>
  );
}
