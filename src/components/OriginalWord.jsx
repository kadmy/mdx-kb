/**
 * @file OriginalWord.jsx
 * @description Компонент для отображения слов на языке оригинала (иврит, греческий)
 * с транслитерацией и правильным направлением текста.
 */

/**
 * OriginalWord - inline компонент для слов на языке оригинала
 * @param {Object} props
 * @param {string} props.lang - Язык: 'hebrew' | 'greek' | 'aramaic' | 'latin'
 * @param {string} props.translit - Транслитерация (латиницей)
 * @param {JSX.Element} props.children - Текст на оригинальном языке
 * @example
 * <OriginalWord lang="hebrew" translit="emunah">אֱמוּנָה</OriginalWord>
 * <OriginalWord lang="greek" translit="pistis">πίστις</OriginalWord>
 */
export function OriginalWord(props) {
  const langConfig = {
    hebrew: {
      dir: 'rtl',
      font: '"SBL Hebrew", "Ezra SIL", "Times New Roman", serif',
      label: 'Иврит'
    },
    greek: {
      dir: 'ltr',
      font: '"SBL Greek", "Galatia SIL", "Times New Roman", serif',
      label: 'Греч.'
    },
    aramaic: {
      dir: 'rtl',
      font: '"SBL Hebrew", "Ezra SIL", "Times New Roman", serif',
      label: 'Арам.'
    },
    latin: {
      dir: 'ltr',
      font: '"Palatino Linotype", "Book Antiqua", Palatino, serif',
      label: 'Лат.'
    }
  };

  const config = langConfig[props.lang] || langConfig.greek;

  return (
    <span
      class="original-word"
      data-lang={props.lang}
      data-translit={props.translit}
      title={props.translit ? `${config.label}: ${props.translit}` : undefined}
      style={{
        'font-family': config.font,
        'direction': config.dir,
        'unicode-bidi': 'embed',
        'font-size': '1.05em',
        'font-weight': '500',
        'color': 'var(--accent-green, #66cc99)',
        'padding': '0 0.15em',
        'white-space': 'nowrap',
        'cursor': 'help',
        'border-bottom': '1px dotted var(--accent-green, #66cc99)',
      }}
    >
      {props.children}
    </span>
  );
}
