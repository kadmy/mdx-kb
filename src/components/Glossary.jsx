/**
 * @file Glossary.jsx
 * @description Компонент для автоматического создания глоссария по списку терминов.
 */
import { For } from 'solid-js';
import { getTermDefinition } from '../data/terms';

export function Glossary(props) {
  const termsWithDefs = () => props.terms.map(term => ({
    name: term,
    definition: getTermDefinition(term)
  }));

  return (
    <dl class="glossary-list">
      <For each={termsWithDefs()}>
        {(item) => (
          <>
            <dt>{item.name}</dt>
            <dd>{item.definition}</dd>
          </>        )}
      </For>
    </dl>
  );
}
