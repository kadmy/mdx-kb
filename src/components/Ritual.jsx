/**
 * @file Ritual.jsx
 * @description Блочный компонент для описания еврейских ритуалов и практик.
 * Используется для объяснения обрядов в их богословском и культурном контексте.
 */

/**
 * Ritual - блочный компонент для описания ритуала
 * @param {Object} props
 * @param {string} props.id - Уникальный ID ритуала (e.g., "brit_milah", "pesach", "tefillin")
 * @param {string} props.title - Название ритуала (e.g., "Брит-Мила (Обрезание)")
 * @param {JSX.Element} props.children - Описание ритуала, его значения и практики
 * @example
 * <Ritual id="brit_milah" title="Брит-Мила (Обрезание)">
 *   **Внешний аспект:** "Знак" завета на плоти
 *   (<ScriptureRef book="Быт" chapter="17" verse="11" />).
 *   Это не "средство" получения завета, а физическое
 *   свидетельство принадлежности к нему и послушания.
 * </Ritual>
 */
export function Ritual(props) {
  return (
    <div
      class="ritual"
      data-ritual-id={props.id}
      data-title={props.title}
      style={{
        'margin': '1.5em 0',
        'padding': '1.25em 1.5em',
        'border': '2px dashed var(--accent-yellow, #f4a261)',
        'border-radius': '8px',
        'background-color': 'rgba(244, 162, 97, 0.05)',
        'font-family': 'inherit',
        'position': 'relative',
      }}
    >
      {/* Иконка для визуальной идентификации */}
      <div
        style={{
          'position': 'absolute',
          'top': '1em',
          'right': '1em',
          'font-size': '1.5em',
          'color': 'var(--accent-yellow, #f4a261)',
          'opacity': '0.3',
        }}
      >
        🕎
      </div>

      <div
        style={{
          'font-weight': '700',
          'font-size': '1.05em',
          'color': 'var(--accent-yellow, #f4a261)',
          'margin-bottom': '0.75em',
          'padding-right': '2em', // Отступ для иконки
        }}
      >
        {props.title}
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
