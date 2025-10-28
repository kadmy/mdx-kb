/**
 * @file KnowledgeFragment.jsx
 * @description Ключевой компонент для RAG-системы. Маркирует фрагмент текста как аспект концепции,
 * позволяя собирать "размазанное знание" из разных документов в один концептуальный хаб.
 */

/**
 * KnowledgeFragment - компонент для маркировки фрагментов знаний
 * @param {Object} props
 * @param {string} props.concept - ID концепции (required, e.g., "emunah", "brit", "logos")
 * @param {string} props.aspect - Аспект знания (required):
 *   - "etymological" - этимология, происхождение термина
 *   - "definition" - определение, базовое значение
 *   - "application" - практическое применение, примеры
 *   - "problem" - проблемные вопросы, сложности
 *   - "polemic" - полемика, споры, разные мнения
 *   - "comparative" - сравнительный анализ
 *   - "interpretation" - толкование, интерпретация
 *   - "historical" - исторический контекст
 *   - "theological" - богословское значение
 * @param {JSX.Element} props.children - Содержимое фрагмента знания
 * @example
 * <KnowledgeFragment concept="emunah" aspect="definition">
 *   В еврейском сознании — это не просто интеллектуальное согласие,
 *   а **стойкая верность, надежность, доверие в действии**.
 * </KnowledgeFragment>
 */
export function KnowledgeFragment(props) {
  // Конфигурация для разных аспектов
  const aspectConfig = {
    etymological: { label: 'Этимология', icon: '🔤', color: '#8e7cc3' },
    definition: { label: 'Определение', icon: '📖', color: '#5fa8d3' },
    application: { label: 'Применение', icon: '⚙️', color: '#66cc99' },
    problem: { label: 'Проблема', icon: '❓', color: '#e76f51' },
    polemic: { label: 'Полемика', icon: '⚔️', color: '#d4a373' },
    comparative: { label: 'Сравнение', icon: '⚖️', color: '#b392ac' },
    interpretation: { label: 'Толкование', icon: '💭', color: '#5fa8d3' },
    historical: { label: 'История', icon: '📜', color: '#d4a373' },
    theological: { label: 'Богословие', icon: '✞', color: '#8e7cc3' },
  };

  const config = aspectConfig[props.aspect] || {
    label: props.aspect,
    icon: '●',
    color: '#66cc99',
  };

  return (
    <div
      class="knowledge-fragment"
      data-concept={props.concept}
      data-aspect={props.aspect}
      style={{
        'margin': '1em 0',
        'padding': '0.75em 1em 0.75em 3em',
        'border-left': `3px solid ${config.color}`,
        'background': `linear-gradient(90deg, ${config.color}10 0%, transparent 100%)`,
        'border-radius': '4px',
        'font-family': 'inherit',
        'position': 'relative',
      }}
    >
      {/* Метка аспекта */}
      <div
        style={{
          'position': 'absolute',
          'left': '0.75em',
          'top': '0.75em',
          'font-size': '1.2em',
          'color': config.color,
          'opacity': '0.7',
        }}
        title={`${config.label}: ${props.concept}`}
      >
        {config.icon}
      </div>

      {/* Содержимое фрагмента */}
      <div
        style={{
          'line-height': '1.6',
          'color': 'var(--text-primary, #d4d9d0)',
        }}
      >
        {props.children}
      </div>

      {/* Метаинформация внизу (опционально) */}
      <div
        style={{
          'margin-top': '0.5em',
          'padding-top': '0.5em',
          'border-top': `1px solid ${config.color}30`,
          'font-size': '0.8em',
          'color': config.color,
          'opacity': '0.6',
          'font-style': 'italic',
        }}
      >
        {config.label} → {props.concept}
      </div>
    </div>
  );
}
