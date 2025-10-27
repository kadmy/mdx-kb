/**
 * @file PersonRef.jsx
 * @description Inline-ссылка на историческую персоналию.
 * Связывается с базой персон и показывает информацию при клике.
 */

/**
 * PersonRef - inline компонент для ссылки на персону
 * @param {Object} props
 * @param {string} props.personKey - Уникальный ключ персоны (e.g., "avraham", "moshe", "yeshua")
 * @param {JSX.Element} props.children - Отображаемое имя (если не указано, берётся из базы)
 * @example
 * <PersonRef personKey="avraham">Авраам</PersonRef>
 * <PersonRef personKey="yeshua">Йешуа</PersonRef>
 */
export function PersonRef(props) {
  const handleClick = (e) => {
    e.preventDefault();

    // Диспатчим кастомное событие для показа информации о персоне
    const event = new CustomEvent('showPerson', {
      detail: { personKey: props.personKey },
      bubbles: true,
    });
    e.target.dispatchEvent(event);
  };

  return (
    <span
      class="person-ref"
      data-person-key={props.personKey}
      onClick={handleClick}
      style={{
        'color': 'var(--page-color, #ffaa66)',
        'cursor': 'pointer',
        'text-decoration': 'underline',
        'text-decoration-style': 'solid',
        'text-decoration-color': 'var(--page-color, #ffaa66)',
        'text-underline-offset': '2px',
        'font-weight': '500',
        'transition': 'color 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = 'var(--accent-orange, #ff8c42)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = 'var(--page-color, #ffaa66)';
      }}
    >
      {props.children}
    </span>
  );
}
