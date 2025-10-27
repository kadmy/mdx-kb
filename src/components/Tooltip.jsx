import { createSignal, Show, onCleanup } from 'solid-js';

/**
 * Настоящий Tooltip компонент (вместо title attribute)
 */
export function Tooltip(props) {
  const [position, setPosition] = createSignal({ x: 0, y: 0 });
  const [visible, setVisible] = createSignal(false);
  let hideTimeout;

  const handleMouseEnter = (e) => {
    clearTimeout(hideTimeout);
    setVisible(true);
    updatePosition(e);
  };

  const handleMouseMove = (e) => {
    if (visible()) {
      updatePosition(e);
    }
  };

  const handleMouseLeave = () => {
    hideTimeout = setTimeout(() => {
      setVisible(false);
    }, 100);
  };

  const updatePosition = (e) => {
    setPosition({
      x: e.clientX + 10,
      y: e.clientY + 10
    });
  };

  onCleanup(() => {
    clearTimeout(hideTimeout);
  });

  return (
    <>
      <span
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={props.style}
        class={props.class}
      >
        {props.children}
      </span>
      <Show when={visible() && props.content}>
        <div
          class="tooltip-popup"
          style={{
            position: 'fixed',
            left: `${position().x}px`,
            top: `${position().y}px`,
            background: 'var(--bg-medium, #1a3a3a)',
            border: '1px solid var(--border-dim, #884422)',
            'border-radius': '4px',
            padding: '0.75rem',
            'max-width': '350px',
            'z-index': 10000,
            'box-shadow': '0 4px 12px rgba(0,0,0,0.6)',
            'pointer-events': 'none',
            color: 'var(--text-primary, #d4d9d0)',
            'font-size': '0.9rem',
            'line-height': '1.5'
          }}
        >
          {props.content}
        </div>
      </Show>
    </>
  );
}