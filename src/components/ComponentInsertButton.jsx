/**
 * @file ComponentInsertButton.jsx
 * @description Кнопка для вставки MDX компонентов с меню
 */

import { createSignal, createEffect, Show, onCleanup } from 'solid-js';
import { Portal } from 'solid-js/web';

/**
 * Компонент кнопки вставки с меню компонентов
 * @param {Object} props
 * @param {Object} props.editor - Monaco editor instance
 */
export function ComponentInsertButton(props) {
  const [showMenu, setShowMenu] = createSignal(false);
  const [buttonPosition, setButtonPosition] = createSignal({ top: 0, left: 0, show: false });
  const [menuPosition, setMenuPosition] = createSignal({ top: 0, left: 0 });
  let menuRef;

  // Список компонентов с русскими названиями
  const components = [
    {
      category: 'Inline компоненты',
      items: [
        {
          label: 'Слово на языке оригинала',
          snippet: '<OriginalWord lang="hebrew" translit="transliteration"></OriginalWord>',
        },
        {
          label: 'Ссылка на персону',
          snippet: '<PersonRef personKey="person_id"></PersonRef>',
        },
        {
          label: 'Ссылка на стих',
          snippet: '<ScriptureRef book="Быт" chapter="1" verse="1" />',
        },
        {
          label: 'Ссылка на место',
          snippet: '<PlaceRef placeKey="place_id"></PlaceRef>',
        },
        {
          label: 'Ссылка на источник',
          snippet: '<SourceRef title="Название источника"></SourceRef>',
        },
      ],
    },
    {
      category: 'Блочные компоненты',
      items: [
        {
          label: 'Цитата из Писания',
          snippet: '<BibleVerse book="Книга" chapter="1" verse="1" translation="Синод.">\nТекст цитаты\n</BibleVerse>',
        },
        {
          label: 'Определение термина',
          snippet: '<Definition term="Термин" original="оригинал">\nОпределение\n</Definition>',
        },
        {
          label: 'Заметка/Предупреждение',
          snippet: '<Callout type="info" title="Заголовок">\nТекст заметки\n</Callout>',
        },
        {
          label: 'Еврейский контекст',
          snippet: '<JewishContext title="Заголовок">\nОбъяснение в еврейском контексте\n</JewishContext>',
        },
        {
          label: 'Описание ритуала',
          snippet: '<Ritual id="ritual_id" title="Название ритуала">\nОписание ритуала\n</Ritual>',
        },
      ],
    },
    {
      category: 'Структурные компоненты',
      items: [
        {
          label: 'Раздел аргументации',
          snippet: '<ArgumentSection thesis="Главный тезис">\n\n<SupportPoint title="Довод">\nТекст довода\n</SupportPoint>\n\n</ArgumentSection>',
        },
        {
          label: 'Довод в поддержку',
          snippet: '<SupportPoint title="Название довода">\nТекст довода\n</SupportPoint>',
        },
        {
          label: 'Контраргумент',
          snippet: '<CounterArgument title="Контртезис">\nТекст контраргумента\n</CounterArgument>',
        },
        {
          label: 'Опровержение',
          snippet: '<Rebuttal summary="Краткий итог">\nТекст опровержения\n</Rebuttal>',
        },
        {
          label: 'Заключение/Синтез',
          snippet: '<Synthesis>\nИтоговое заключение\n</Synthesis>',
        },
      ],
    },
    {
      category: 'Управление знаниями',
      items: [
        {
          label: 'Фрагмент знания (RAG)',
          snippet: '<KnowledgeFragment concept="concept_id" aspect="definition">\nТекст фрагмента знания\n</KnowledgeFragment>',
        },
      ],
    },
  ];

  // Вычисление позиции меню с учётом границ экрана
  const calculateMenuPosition = () => {
    const btnPos = buttonPosition();
    const padding = 10;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Используем реальную высоту меню, если оно уже отрендерено
    // Иначе используем примерную
    const menuWidth = menuRef?.offsetWidth || 320;
    const menuHeight = menuRef?.offsetHeight || 500;

    let top = btnPos.top;
    let left = btnPos.left + 30; // Справа от кнопки

    // Проверяем, помещается ли меню справа
    if (left + menuWidth > viewportWidth) {
      // Не помещается справа - показываем слева от кнопки
      left = btnPos.left - menuWidth - 5;
    }

    // Не даём меню уйти за левую границу
    if (left < 0) {
      left = padding;
    }

    // Проверяем, помещается ли меню снизу
    const spaceBelow = viewportHeight - top;
    if (menuHeight > spaceBelow - padding) {
      // Не помещается - смещаем вверх на разницу + padding
      top = top - (menuHeight - spaceBelow) - padding;
    }

    // Не даём меню уйти за верхнюю границу
    if (top < padding) {
      top = padding;
    }

    setMenuPosition({ top, left });
  };

  // Обработка вставки компонента
  const insertComponent = (snippet) => {
    const editor = props.editor;
    if (!editor) return;

    const position = editor.getPosition();
    const range = {
      startLineNumber: position.lineNumber,
      startColumn: position.column,
      endLineNumber: position.lineNumber,
      endColumn: position.column,
    };

    editor.executeEdits('insert-component', [
      {
        range,
        text: snippet,
      },
    ]);

    editor.focus();
    setShowMenu(false);
  };

  // Обновление позиции кнопки при изменении курсора
  const updateButtonPosition = () => {
    const editor = props.editor;
    if (!editor) return;

    const position = editor.getPosition();
    const column = position.column;

    // Показываем кнопку только если курсор в начале строки (column === 1)
    if (column === 1) {
      const domNode = editor.getDomNode();
      if (!domNode) return;

      const coords = editor.getScrolledVisiblePosition(position);
      if (!coords) return;

      const editorRect = domNode.getBoundingClientRect();

      setButtonPosition({
        top: coords.top + editorRect.top,
        left: editorRect.left - 30, // Слева от редактора
        show: true,
      });
    } else {
      setButtonPosition({ ...buttonPosition(), show: false });
    }
  };

  // Подписка на события курсора через createEffect для реактивности
  createEffect(() => {
    const editor = props.editor;
    if (!editor) return;

    // Проверяем, что editor полностью инициализирован
    if (typeof editor.onDidChangeCursorPosition !== 'function') {
      return;
    }

    const disposable = editor.onDidChangeCursorPosition(updateButtonPosition);
    onCleanup(() => {
      if (disposable) {
        disposable.dispose();
      }
    });

    // Начальная установка позиции
    updateButtonPosition();
  });

  // Пересчёт позиции меню после его рендера (когда ref доступен)
  createEffect(() => {
    if (showMenu() && menuRef) {
      // Небольшая задержка, чтобы DOM успел обновиться
      setTimeout(() => {
        calculateMenuPosition();
      }, 0);
    }
  });

  return (
    <>
      {/* Кнопка вставки */}
      <Show when={buttonPosition().show}>
        <button
          style={{
            position: 'fixed',
            top: `${buttonPosition().top}px`,
            left: `${buttonPosition().left}px`,
            width: '24px',
            height: '24px',
            'background-color': 'var(--accent-green, #66cc99)',
            color: 'var(--bg-primary, #1a1e23)',
            border: 'none',
            'border-radius': '4px',
            cursor: 'pointer',
            'font-size': '16px',
            display: 'flex',
            'align-items': 'center',
            'justify-content': 'center',
            'z-index': 1000,
            padding: 0,
          }}
          onClick={() => {
            const newState = !showMenu();
            setShowMenu(newState);
            if (newState) {
              calculateMenuPosition();
            }
          }}
          title="Вставить компонент"
        >
          +
        </button>
      </Show>

      {/* Меню компонентов - через Portal чтобы не обрезалось */}
      <Portal>
        <Show when={showMenu()}>
          <div
            ref={menuRef}
            style={{
              position: 'fixed',
              top: `${menuPosition().top}px`,
              left: `${menuPosition().left}px`,
            'background-color': 'var(--bg-secondary, #0f1419)',
            border: '1px solid var(--border-dim, #2d3640)',
            'border-radius': '8px',
            padding: '8px',
            'max-height': '70vh',
            'overflow-y': 'auto',
            'z-index': 1001,
            'min-width': '300px',
            'box-shadow': '0 4px 12px rgba(0, 0, 0, 0.3)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {components.map((category) => (
            <div style={{ 'margin-bottom': '12px' }}>
              <div
                style={{
                  'font-size': '0.85em',
                  'font-weight': '700',
                  color: 'var(--accent-green, #66cc99)',
                  'margin-bottom': '6px',
                  'text-transform': 'uppercase',
                  'letter-spacing': '0.05em',
                }}
              >
                {category.category}
              </div>
              {category.items.map((item) => (
                <button
                  style={{
                    display: 'block',
                    width: '100%',
                    'text-align': 'left',
                    padding: '8px 12px',
                    'background-color': 'transparent',
                    color: 'var(--text-primary, #d4d9d0)',
                    border: 'none',
                    'border-radius': '4px',
                    cursor: 'pointer',
                    'font-size': '0.95em',
                    'margin-bottom': '2px',
                    transition: 'background-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--accent-green, #66cc99)';
                    e.currentTarget.style.color = 'var(--bg-primary, #1a1e23)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-primary, #d4d9d0)';
                  }}
                  onClick={() => insertComponent(item.snippet)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Overlay для закрытия меню при клике вне */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            'z-index': 999,
          }}
          onClick={() => setShowMenu(false)}
        />
        </Show>
      </Portal>
    </>
  );
}
