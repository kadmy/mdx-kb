import { Show, For } from 'solid-js';

/**
 * Панель для отображения ошибок и предупреждений валидации
 */
export function ValidationPanel(props) {
  const hasIssues = () => {
    return (props.errors?.length > 0) || (props.warnings?.length > 0);
  };

  return (
    <Show when={hasIssues()}>
      <div class="validation-panel">
        <Show when={props.errors?.length > 0}>
          <div class="errors-section">
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#ff6b6b' }}>
              ❌ Ошибки ({props.errors.length})
            </h4>
            <For each={props.errors}>
              {(error) => (
                <div class="error-item" style={{
                  padding: '0.5rem',
                  'margin-bottom': '0.5rem',
                  background: '#3d1f1f',
                  'border-left': '3px solid #ff6b6b',
                  'border-radius': '4px'
                }}>
                  <Show when={error.field}>
                    <strong style={{ color: '#ff6b6b' }}>{error.field}:</strong>{' '}
                  </Show>
                  <span>{error.message}</span>
                  <Show when={error.line}>
                    <div style={{ 'font-size': '0.85em', 'margin-top': '0.25rem', color: '#888' }}>
                      Строка {error.line}{error.column ? `, колонка ${error.column}` : ''}
                    </div>
                  </Show>
                </div>
              )}
            </For>
          </div>
        </Show>

        <Show when={props.warnings?.length > 0}>
          <div class="warnings-section" style={{ 'margin-top': '1rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#e5c07b' }}>
              ⚠️ Предупреждения ({props.warnings.length})
            </h4>
            <For each={props.warnings}>
              {(warning) => (
                <div class="warning-item" style={{
                  padding: '0.5rem',
                  'margin-bottom': '0.5rem',
                  background: '#3d3020',
                  'border-left': '3px solid #e5c07b',
                  'border-radius': '4px'
                }}>
                  <span>{warning.message}</span>
                </div>
              )}
            </For>
          </div>
        </Show>
      </div>
    </Show>
  );
}