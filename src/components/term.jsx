/**
 * @file term.jsx
 * @description Компонент, показывающий определение термина во всплывающем окне.
 * Использует настоящий Tooltip компонент.
 */

import { Tooltip } from './Tooltip';
import { getTermDefinition } from '../data/terms';

export function Term(props) {
  const description = getTermDefinition(props.term);

  return (
    <Tooltip content={description}>
      <span class="term-popup">
        {props.children}
      </span>
    </Tooltip>
  );
}
