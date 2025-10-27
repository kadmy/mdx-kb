import { createSignal, onError, Show } from 'solid-js';

/**
 * ErrorBoundary для перехвата ошибок рендеринга в preview
 */
export function ErrorBoundary(props) {
  const [error, setError] = createSignal(null);

  onError((err) => {
    console.error('Preview rendering error:', err);
    setError(err);
  });

  return (
    <Show
      when={!error()}
      fallback={
        <div class="error-display">
          <h3>Ошибка рендеринга</h3>
          <pre style={{
            'white-space': 'pre-wrap',
            'word-wrap': 'break-word',
            background: '#3d1f1f',
            padding: '1rem',
            'border-radius': '4px',
            color: '#ff6b6b'
          }}>
            {error()?.message || String(error())}
          </pre>
          <button
            onClick={() => setError(null)}
            style={{
              'margin-top': '1rem',
              padding: '0.5rem 1rem',
              background: '#61afef',
              border: 'none',
              'border-radius': '4px',
              cursor: 'pointer',
              color: '#21252b'
            }}
          >
            Сбросить ошибку
          </button>
        </div>
      }
    >
      {props.children}
    </Show>
  );
}