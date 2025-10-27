/**
 * @file Callout.jsx
 * @description Блочный компонент для привлечения внимания: заметки, предупреждения, спорные моменты.
 * Поддерживает различные типы для визуальной дифференциации.
 */

/**
 * Callout - блочный компонент для выделенных блоков информации
 * @param {Object} props
 * @param {string} props.type - Тип блока: "info", "warning", "doctrine", "interpretation", "danger"
 * @param {string} [props.title] - Заголовок блока (опционально)
 * @param {JSX.Element} props.children - Содержимое блока
 * @example
 * <Callout type="interpretation" title="Разные толкования">
 *   Этот стих является предметом давних богословских дискуссий
 *   между различными традициями.
 * </Callout>
 *
 * <Callout type="info">
 *   Эта практика описана в "Дидахе" и может не отражать
 *   всеобщую церковную практику того времени.
 * </Callout>
 */
export function Callout(props) {
  // Конфигурация стилей для разных типов
  const typeConfig = {
    info: {
      color: 'var(--accent-blue, #5fa8d3)',
      icon: 'ℹ',
      label: 'Информация',
    },
    warning: {
      color: 'var(--accent-yellow, #f4a261)',
      icon: '⚠',
      label: 'Предупреждение',
    },
    doctrine: {
      color: 'var(--accent-purple, #b392ac)',
      icon: '✞',
      label: 'Доктрина',
    },
    interpretation: {
      color: 'var(--accent-green, #66cc99)',
      icon: '◈',
      label: 'Толкование',
    },
    danger: {
      color: 'var(--accent-red, #e76f51)',
      icon: '⚡',
      label: 'Важно',
    },
  };

  const config = typeConfig[props.type] || typeConfig.info;

  return (
    <div
      class="callout"
      data-type={props.type}
      style={{
        'margin': '1.5em 0',
        'padding': '1em 1.5em',
        'border-left': `4px solid ${config.color}`,
        'background-color': `${config.color}15`,
        'border-radius': '4px',
        'font-family': 'inherit',
      }}
    >
      {props.title && (
        <div
          style={{
            'font-weight': '700',
            'color': config.color,
            'margin-bottom': '0.5em',
            'display': 'flex',
            'align-items': 'center',
            'gap': '0.5em',
            'font-size': '1.05em',
          }}
        >
          <span style={{ 'font-size': '1.2em' }}>{config.icon}</span>
          <span>{props.title}</span>
        </div>
      )}
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
