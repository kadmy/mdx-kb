import { Show } from 'solid-js';
import './Modal.css';

export function Modal(props) {
  return (
    <Show when={props.show}>
      <div class="modal-backdrop" onClick={() => props.onClose()}>
        <div class="modal-content" onClick={(e) => e.stopPropagation()}>
          <button class="modal-close-btn" onClick={() => props.onClose()}>×</button>
          {props.children}
        </div>
      </div>
    </Show>
  );
}
