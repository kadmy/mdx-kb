/**
 * @file JewishContext.jsx
 * @description Блочный компонент для объяснения еврейского культурного и богословского контекста.
 * Помогает понимать концепции через призму еврейского первоисточника.
 */

/**
 * JewishContext - блочный компонент для еврейского контекста
 * @param {Object} props
 * @param {string} props.title - Заголовок контекстного блока
 * @param {JSX.Element} props.children - Содержимое: объяснение концепции в еврейском контексте
 * @example
 * <JewishContext title="Что такое 'Эмуна'?">
 *   Слово <OriginalWord lang="hebrew" translit="emunah">אֱמוּנָה</OriginalWord>
 *   (часто переводимое как "вера") в еврейском сознании — это не
 *   просто интеллектуальное согласие. Это **стойкая верность,
 *   надежность, доверие в действии**.
 * </JewishContext>
 */
export function JewishContext(props) {
  return (
    <div
      class="jewish-context"
      data-title={props.title}
      style={{
        'margin': '1.5em 0',
        'padding': '1.25em 1.5em',
        'border': '2px solid var(--accent-purple, #b392ac)',
        'border-radius': '8px',
        'background': 'linear-gradient(135deg, rgba(179, 146, 172, 0.08) 0%, rgba(179, 146, 172, 0.03) 100%)',
        'font-family': 'inherit',
        'position': 'relative',
      }}
    >
      {/* Иконка "Звезда Давида" для визуальной идентификации */}
      <div
        style={{
          'position': 'absolute',
          'top': '1em',
          'right': '1em',
          'font-size': '1.5em',
          'color': 'var(--accent-purple, #b392ac)',
          'opacity': '0.3',
        }}
      >
        ✡
      </div>

      <div
        style={{
          'font-weight': '700',
          'font-size': '1.05em',
          'color': 'var(--accent-purple, #b392ac)',
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
