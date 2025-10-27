/**
 * @file PlaceRef.jsx
 * @description Inline-ссылка на географическое место (город, регион).
 * Используется для разметки географических локаций с возможностью показа на карте.
 */

/**
 * PlaceRef - inline компонент для ссылки на место
 * @param {Object} props
 * @param {string} props.placeKey - Уникальный ID места (e.g., "antioch", "alexandria", "jerusalem")
 * @param {string} [props.mapId] - Координаты или ссылка для интерактивной карты (опционально)
 * @param {JSX.Element} props.children - Текст для отображения (название места)
 * @example
 * <PlaceRef placeKey="alexandria">Александрии</PlaceRef>
 * <PlaceRef placeKey="jerusalem" mapId="31.7683,35.2137">Иерусалиме</PlaceRef>
 */
export function PlaceRef(props) {
  const handleClick = (e) => {
    e.preventDefault();

    // Диспатчим событие для показа информации о месте (или открытия карты)
    const event = new CustomEvent('showPlace', {
      detail: {
        placeKey: props.placeKey,
        mapId: props.mapId,
      },
      bubbles: true,
    });
    e.target.dispatchEvent(event);
  };

  return (
    <span
      class="place-ref"
      data-place-key={props.placeKey}
      data-map-id={props.mapId}
      title={props.mapId ? `${props.children} (карта: ${props.mapId})` : props.children}
      onClick={handleClick}
      style={{
        'color': 'var(--accent-yellow, #f4a261)',
        'cursor': 'pointer',
        'font-weight': '500',
        'font-family': 'inherit',
        'border-bottom': '1px solid var(--accent-yellow, #f4a261)',
        'text-decoration': 'none',
        'transition': 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderBottom = '2px solid var(--accent-yellow, #f4a261)';
        e.currentTarget.style.color = 'var(--text-primary, #d4d9d0)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderBottom = '1px solid var(--accent-yellow, #f4a261)';
        e.currentTarget.style.color = 'var(--accent-yellow, #f4a261)';
      }}
    >
      {props.children}
    </span>
  );
}
