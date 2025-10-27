/**
 * @file ConceptLink.jsx
 * @description Интерактивная ссылка на концепцию.
 * При наведении курсора генерирует события для управления модальным окном.
 */
export function Concept(props) {
  const handleClick = (e) => {
    e.preventDefault(); // Предотвращаем переход по ссылке
    const event = new CustomEvent('showConcept', {
      bubbles: true,
      composed: true,
      detail: { id: props.id, element: e.currentTarget },
    });
    e.currentTarget.dispatchEvent(event);
  };

  return (
    <a
      href={`#concept-${props.id}`}
      class="concept-link"
      style={{ color: '#61afef' }} // Изменен цвет для темной темы
      onClick={handleClick}
      title={`Узнать больше о концепции: ${props.id}`}
    >
      {props.children}
    </a>
  );
}
