import { Buffer } from 'buffer';
window.Buffer = Buffer; // Глобальный полифил для Buffer

// Настройка Monaco Environment для подавления предупреждений о web workers
window.MonacoEnvironment = {
  getWorker() {
    return new Worker(
      URL.createObjectURL(
        new Blob(['self.MonacoEnvironment = { baseUrl: "/" };'], { type: 'text/javascript' })
      )
    );
  }
};

import { createSignal, createEffect, onCleanup, onMount, Show } from 'solid-js';
import matter from 'gray-matter';
import yaml from 'js-yaml';
import { MonacoEditor } from 'solid-monaco';

// Импортируем MDX компоненты
import * as MDXComponents from './components/mdx-components.js';

// Импортируем UI компоненты
import { Modal } from './components/Modal.jsx';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import { ValidationPanel } from './components/ValidationPanel.jsx';
import { FrontmatterForm } from './components/FrontmatterForm.jsx';
import { ComponentInsertButton } from './components/ComponentInsertButton.jsx';

// Сервисы
import { compileMDX } from './services/mdx-compiler.js';
import { validateYAML, validateFullDocument } from './services/validator.js';
import { debounce } from './utils/debounce.js';

// Данные
import { getConcept } from './data/concepts.js';

// Monaco тема
import { cookTheme } from './utils/monaco-theme.js';

// Собираем все компоненты, которые будут доступны в MDX
// mdx-compiler.js автоматически создаст lowercase варианты
const components = {
  ...MDXComponents
};

function App() {
  // Состояние редактора
  const [editorContent, setEditorContent] = createSignal('Загрузка...');
  const [frontmatterText, setFrontmatterText] = createSignal('');
  const [originalContent, setOriginalContent] = createSignal(''); // Для отслеживания изменений

  // Состояние предпросмотра
  const [compiledComponent, setCompiledComponent] = createSignal(null);
  const [compileError, setCompileError] = createSignal(null);
  const [isCompiling, setIsCompiling] = createSignal(false);

  // Состояние валидации
  const [validationErrors, setValidationErrors] = createSignal([]);
  const [validationWarnings, setValidationWarnings] = createSignal([]);

  // Состояние сохранения
  const [saveStatus, setSaveStatus] = createSignal('idle'); // idle, saving, saved, error

  // Модальное окно для концепций
  const [modalData, setModalData] = createSignal(null);

  // Состояние для сворачивания метаданных и контента
  const [metadataCollapsed, setMetadataCollapsed] = createSignal(false);
  const [contentCollapsed, setContentCollapsed] = createSignal(false);

  // Состояние для Monaco editor instance
  const [editorInstance, setEditorInstance] = createSignal(null);

  // Обработчик монтирования Monaco Editor - регистрируем и применяем тему
  const handleEditorMount = (monaco) => {
    // Регистрируем кастомную тему и сразу применяем
    try {
      monaco.editor.defineTheme('cook-theme', cookTheme);
      monaco.editor.setTheme('cook-theme');
      console.log('✓ Cook theme applied');
    } catch (error) {
      console.error('Failed to apply theme:', error);
    }

    // Получаем editor instance через monaco.editor API
    setTimeout(() => {
      if (typeof monaco.editor.getEditors === 'function') {
        const editors = monaco.editor.getEditors();
        if (editors && editors.length > 0) {
          setEditorInstance(editors[0]);
          console.log('✓ Editor instance captured');
        }
      }
    }, 100);
  };

  // Нормализация полного текста (frontmatter + content) для корректного сравнения
  const normalizeFull = (fullText) => {
    try {
      const parsed = matter(fullText || '');
      const stableYaml = yaml.dump(parsed.data || {}, { lineWidth: -1 });
      return `---\n${stableYaml.trim()}\n---\n\n${parsed.content}`;
    } catch {
      return (fullText || '').trim();
    }
  };

  // Проверка несохраненных изменений (с учетом нормализации форматирования)
  const hasUnsavedChanges = () => {
    const current = normalizeFull(buildFullContent());
    const original = normalizeFull(originalContent());
    return current !== original;
  };

  const buildFullContent = () => {
    const fmText = frontmatterText().trim();
    if (fmText) {
      return `---\n${fmText}\n---\n\n${editorContent()}`;
    }
    return editorContent();
  };

  // Runtime compilation с debounce
  const debouncedCompile = debounce(async () => {
    setIsCompiling(true);
    setCompileError(null);

    // Валидация YAML
    const yamlValidation = validateYAML(frontmatterText());

    // Валидация всего документа
    const docValidation = validateFullDocument(frontmatterText(), editorContent());

    setValidationErrors(docValidation.errors);
    setValidationWarnings(docValidation.warnings);

    // Если есть критические ошибки YAML, не компилируем
    if (!yamlValidation.valid) {
      setIsCompiling(false);
      return;
    }

    // Собираем полный MDX контент
    const fullMDX = buildFullContent();

    // Компилируем
    const result = await compileMDX(fullMDX, components);

    if (result.error) {
      setCompileError(result.error);
      setCompiledComponent(null);
    } else {
      setCompileError(null);
      setCompiledComponent(() => result.Component);
    }

    setIsCompiling(false);
  }, 500); // Увеличиваем debounce для экономии ресурсов

  // Автокомпиляция при изменении контента
  createEffect(() => {
    // Триггерим на изменение frontmatter или content
    frontmatterText();
    editorContent();

    // Не компилируем если контент еще загружается
    if (editorContent() !== 'Загрузка...') {
      debouncedCompile();
    }
  });

  const handleShowConcept = async (e) => {
    const { id } = e.detail;

    // Получаем данные концепции из единого источника
    const concept = getConcept(id);

    if (concept) {
      // Компилируем markdown контент как MDX
      const mdxContent = concept.content;
      const result = await compileMDX(mdxContent, components);

      if (result.error) {
        // Если не удалось скомпилировать, показываем ошибку
        setModalData({
          title: concept.title,
          description: concept.description,
          Component: () => (
            <div style={{ color: '#ff6b6b' }}>
              <p>Ошибка компиляции контента концепции:</p>
              <pre>{result.error.message}</pre>
            </div>
          ),
          relatedTerms: concept.relatedTerms,
          relatedConcepts: concept.relatedConcepts
        });
      } else {
        // Успешно скомпилировали - передаем компонент
        setModalData({
          title: concept.title,
          description: concept.description,
          Component: result.Component,
          relatedTerms: concept.relatedTerms,
          relatedConcepts: concept.relatedConcepts
        });
      }
    } else {
      setModalData({
        title: 'Ошибка',
        Component: () => <p>Концепция с ID "{id}" не найдена.</p>
      });
    }
  };

  // Удалено автоскрытие модального окна (старое поведение). Закрытие теперь только по крестику.

  const handleSave = async () => {
    // Проверяем валидацию перед сохранением
    if (validationErrors().length > 0) {
      alert('Невозможно сохранить: есть ошибки валидации');
      return;
    }

    setSaveStatus('saving');
    try {
      const fileContent = buildFullContent();
      console.log('=== SAVING FILE ===');
      console.log('frontmatterText:', frontmatterText());
      console.log('Full content to save:', fileContent);

      const response = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: fileContent }),
      });

      if (!response.ok) throw new Error('Server error');

      // Обновляем original content после успешного сохранения
      setOriginalContent(fileContent);
      console.log('✓ Saved successfully, originalContent updated');
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to save:', error);
      setSaveStatus('error');
      alert('Ошибка сохранения! ' + error.message);
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  // Предупреждение о несохраненных изменениях
  const handleBeforeUnload = (e) => {
    if (hasUnsavedChanges()) {
      e.preventDefault();
      e.returnValue = '';
    }
  };

  onMount(async () => {
    try {
      const response = await fetch('/api/load');
      const data = await response.json();
      const { content, data: fmData } = matter(data.content);
      // Нормализуем frontmatter под формат формы, чтобы не было ложных "несохраненных изменений"
      const normalizeCreated = (value) => {
        if (!value) return '';
        try {
          const d = new Date(value);
          if (isNaN(d.getTime())) return String(value);
          return d.toISOString().split('T')[0]; // YYYY-MM-DD
        } catch {
          return String(value);
        }
      };

      const normalizedData = {};
      // === 1. Основные метаданные ===
      if (fmData?.title) normalizedData.title = fmData.title;
      if (fmData?.description) normalizedData.description = fmData.description;
      if (fmData?.date) normalizedData.date = normalizeCreated(fmData.date);
      if (fmData?.draft !== undefined) normalizedData.draft = fmData.draft;

      // === 2. Организационные фасеты ===
      if (fmData?.content_type) normalizedData.content_type = fmData.content_type;
      if (fmData?.level) normalizedData.level = fmData.level;
      if (fmData?.series) normalizedData.series = fmData.series;
      if (fmData?.part) normalizedData.part = fmData.part;
      if (fmData?.origin) normalizedData.origin = fmData.origin;

      const normalizedYaml = yaml.dump(normalizedData, { lineWidth: -1 });

      setEditorContent(content);
      setFrontmatterText(normalizedYaml);

      // Сохраняем нормализованный оригинал, совпадающий с видом формы
      const normalizedFull = `---\n${normalizedYaml}\n---\n\n${content}`;
      setOriginalContent(normalizedFull);

      // Дожидаемся возможной первичной синхронизации формы (которая может немного изменить формат YAML)
      // и фиксируем это как исходное состояние, чтобы не было ложного индикатора изменений
      setTimeout(() => {
        setOriginalContent(buildFullContent());
      }, 0);
    } catch (error) {
      console.error("Failed to load initial content:", error);
      setEditorContent("Не удалось загрузить контент. Убедитесь, что dev-сервер запущен (npm run dev).");
    }

    window.addEventListener('showConcept', handleShowConcept);
    window.addEventListener('beforeunload', handleBeforeUnload);
  });

  onCleanup(() => {
    window.removeEventListener('showConcept', handleShowConcept);
    window.removeEventListener('beforeunload', handleBeforeUnload);
  });

  return (
    <>
      <style>{`
        /* Палитра из solid-version */
        :root {
          --bg-deep: #072828;
          --bg-medium: #1a3a3a;
          --bg-card: #163232;
          --accent-orange: #ff8c42;
          --accent-green: #66cc99;
          --text-primary: #d4d9d0;
          --text-secondary: #a8b5a8;
          --text-dim: #7a8a7a;
          --border-dim: #884422;
          --page-color: #ffaa66;
        }

        body {
          background: #183333;
          color: var(--text-primary);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }

        .app-container {
          display: flex;
          height: 100vh;
          background: #183333;
        }

        .editor-pane, .preview-pane {
          flex: 1;
          padding: 1rem;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
        }

        .editor-pane {
          background: var(--bg-deep);
          color: var(--text-primary);
          border-right: 1px solid var(--border-dim);
          overflow-y: hidden; /* прокрутка будет на вложенных областях */
        }

        .preview-pane {
          background: var(--bg-card);
          color: var(--text-primary);
          position: relative;
          overflow-y: auto;
        }

        .editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          background: var(--bg-medium);
          border: 1px solid var(--border-dim);
          border-radius: 4px;
          padding: 0.5rem 0.75rem;
        }

        .save-button {
          background: var(--accent-orange);
          color: var(--bg-deep);
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.2s;
        }

        .save-button:hover:not(:disabled) {
          background: var(--page-color);
        }

        .save-button:disabled {
          background: var(--bg-medium);
          color: var(--text-dim);
          cursor: not-allowed;
        }

        .save-button.unsaved {
          background: var(--page-color);
        }

        .status-bar {
          display: flex;
          gap: 1rem;
          align-items: center;
          font-size: 0.85rem;
        }

        .status-indicator {
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
        }

        .status-indicator.compiling {
          background: rgba(255, 170, 102, 0.2);
          color: var(--page-color);
        }

        .status-indicator.unsaved {
          background: rgba(255, 140, 66, 0.2);
          color: var(--accent-orange);
        }

        .validation-panel {
          margin-bottom: 1rem;
          padding: 0.75rem;
          background: var(--bg-medium);
          border-radius: 4px;
        }

        .compile-error {
          padding: 1rem;
          background: rgba(255, 107, 107, 0.1);
          border: 1px solid #ff6b6b;
          border-radius: 4px;
          margin-top: 1rem;
        }

        .preview-content {
          flex-grow: 1;
        }

        .loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(7, 40, 40, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
        }

        /* Стили для терминов и концепций */
        .term-popup {
          border-bottom: 1px dotted var(--accent-green);
          cursor: help;
        }

        .concept-link {
          color: var(--accent-orange);
          text-decoration: none;
          cursor: pointer;
        }

        .concept-link:hover {
          text-decoration: underline;
        }

        /* Monaco Editor - переопределение стилей */
        .monaco-editor,
        .monaco-editor .margin,
        .monaco-editor-background,
        .monaco-editor .inputarea.ime-input {
          background-color: var(--bg-deep) !important;
        }

        .monaco-editor .view-line {
          color: var(--text-primary) !important;
        }

        /* Collapsible секция */
        .collapsible-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          user-select: none;
          margin-bottom: 0.5rem;
        }

        .collapsible-toggle {
          background: none;
          border: none;
          color: var(--accent-orange);
          font-size: 1rem;
          cursor: pointer;
          padding: 0;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s;
        }

        .collapsible-toggle.collapsed {
          transform: rotate(-90deg);
        }

        .collapsible-content {
          transition: max-height 0.3s ease-out, opacity 0.3s ease-out;
          opacity: 1;
        }

        /* Прокручиваемая область для метаданных */
        .metadata-content {
          max-height: 40vh;
          overflow: auto;
          width: 100%;
          box-sizing: border-box;
          overflow-x: hidden;
          padding-right: calc(1rem + 5px); /* доп. отступ от скроллбара */
          flex: 0 1 auto;
          /* Стандартизированная стилизация скролла */
          scrollbar-color: rgba(26, 58, 58, 0.5) #072828; /* thumb / track */
          scrollbar-width: auto; /* шире, чем thin */
          scrollbar-gutter: stable both-edges; /* резерв места под скролл */
        }

        /* Когда контент свёрнут — метаданные занимают почти всю высоту */
        .metadata-content.expanded {
          max-height: none;
          flex: 1 1 auto;
        }

        /* Контентная секция занимает оставшееся место */
        .content-content {
          display: flex;
          flex-direction: column;
          flex: 0 1 auto; /* Не растягивается по умолчанию */
          max-height: 50vh; /* Ограничение по умолчанию */
          overflow: visible; /* Для suggest widget */
        }

        /* Когда метаданные свёрнуты — контент занимает почти всю высоту */
        .content-content.expanded {
          max-height: none;
          flex: 1 1 auto; /* Растягивается на всю доступную высоту */
        }

        .collapsible-content.collapsed {
          max-height: 0 !important;
          opacity: 0;
          overflow: hidden !important;
        }

        /* Стандартизированные настройки скролла для превью */
        .preview-pane {
          scrollbar-color: rgba(26, 58, 58, 0.5) #072828;
          scrollbar-width: auto;
          scrollbar-gutter: stable both-edges;
        }

        /* Monaco suggest widget - позиционирование выше панели */
        .monaco-editor .suggest-widget {
          z-index: 10000 !important;
        }
      `}</style>
      <div class="app-container">
        <div class="editor-pane">
          <div class="editor-header">
            <div class="status-bar">
              <Show when={isCompiling()}>
                <span class="status-indicator compiling">⏳ Компиляция...</span>
              </Show>
              <Show when={hasUnsavedChanges() && !isCompiling()}>
                <span class="status-indicator unsaved">● Есть несохраненные изменения</span>
              </Show>
              <button
                class="save-button"
                classList={{ unsaved: hasUnsavedChanges() }}
                onClick={handleSave}
                disabled={saveStatus() !== 'idle'}
              >
                <Show when={saveStatus() === 'idle'}>
                  {hasUnsavedChanges() ? 'Сохранить *' : 'Сохранить'}
                </Show>
                <Show when={saveStatus() === 'saving'}>Сохранение...</Show>
                <Show when={saveStatus() === 'saved'}>✓ Сохранено!</Show>
                <Show when={saveStatus() === 'error'}>✗ Ошибка!</Show>
              </button>
            </div>
          </div>

          {/* Панель валидации */}
          <ValidationPanel
            errors={validationErrors()}
            warnings={validationWarnings()}
          />

          <div class="collapsible-header" onClick={() => setMetadataCollapsed(!metadataCollapsed())}>
            <button
              class="collapsible-toggle"
              classList={{ collapsed: metadataCollapsed() }}
            >
              ▼
            </button>
            <h3 style={{ margin: 0 }}>Метаданные</h3>
          </div>
          <div class="collapsible-content metadata-content" classList={{ collapsed: metadataCollapsed(), expanded: contentCollapsed() }}>
            <FrontmatterForm
              value={frontmatterText()}
              onChange={setFrontmatterText}
            />
          </div>

          <div class="content-section" style={{ display: 'flex', 'flex-direction': 'column', 'flex-grow': '1' }}>
            <div class="collapsible-header" onClick={() => setContentCollapsed(!contentCollapsed())}>
              <button
                class="collapsible-toggle"
                classList={{ collapsed: contentCollapsed() }}
              >
                ▼
              </button>
              <h3 style={{ margin: 0 }}>Контент (MDX)</h3>
            </div>
            <div class="collapsible-content content-content" classList={{ collapsed: contentCollapsed(), expanded: metadataCollapsed() }}>
              <div style={{ "flex-grow": "1", "min-height": "300px", "border": "1px solid var(--border-dim)", "border-radius": "4px" }}>
                <MonacoEditor
                  value={editorContent()}
                  onChange={(value) => setEditorContent(value || '')}
                  onMount={handleEditorMount}
                  language="markdown"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    wordWrap: 'on',
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    renderWhitespace: 'selection',
                    autoClosingBrackets: 'never',
                    autoClosingQuotes: 'never',
                    autoClosingOvertype: 'never',
                    autoSurround: 'never',
                    suggest: {
                      showWords: false,
                      snippetsPreventQuickSuggestions: false,
                    },
                  }}
                />
              </div>
              {/* Кнопка вставки компонентов */}
              <Show when={editorInstance()}>
                <ComponentInsertButton editor={editorInstance()} />
              </Show>
            </div>
          </div>
        </div>

        <div class="preview-pane">
          <div class="preview-content">
            <ErrorBoundary>
              {/* Показываем ошибку компиляции если есть */}
              <Show when={compileError()}>
                <div class="compile-error">
                  <h3>Ошибка компиляции MDX</h3>
                  <pre style={{ 'white-space': 'pre-wrap', 'word-wrap': 'break-word' }}>
                    {compileError().message}
                  </pre>
                  <Show when={compileError().line}>
                    <p>Строка: {compileError().line}, Колонка: {compileError().column}</p>
                  </Show>
                </div>
              </Show>

              {/* Показываем скомпилированный компонент */}
              <Show when={!compileError() && compiledComponent()}>
                {compiledComponent()}
              </Show>

              {/* Заглушка если еще не скомпилировано */}
              <Show when={!compileError() && !compiledComponent() && !isCompiling()}>
                <p style={{ color: '#888', 'text-align': 'center', 'margin-top': '2rem' }}>
                  Начните редактировать контент для предпросмотра
                </p>
              </Show>
            </ErrorBoundary>
          </div>

          {/* Индикатор компиляции */}
          <Show when={isCompiling()}>
            <div class="loading-overlay">
              <span style={{ color: '#e5c07b', 'font-size': '1.2rem' }}>
                ⏳ Компиляция...
              </span>
            </div>
          </Show>
        </div>
      </div>

      <Modal show={!!modalData()} onClose={() => setModalData(null)}>
        <Show when={modalData()}>
          <div>
            <h2>{modalData().title}</h2>
            <Show when={modalData().description}>
              <p><em>{modalData().description}</em></p>
            </Show>

            <div style={{ 'margin-top': '1.5rem' }}>
              {modalData().Component && modalData().Component()}
            </div>

            <Show when={modalData().relatedTerms?.length > 0}>
              <div style={{ 'margin-top': '2rem', 'padding-top': '1rem', 'border-top': '1px solid var(--border-dim)' }}>
                <strong>Связанные термины:</strong>{' '}
                {modalData().relatedTerms.join(', ')}
              </div>
            </Show>

            <Show when={modalData().relatedConcepts?.length > 0}>
              <div style={{ 'margin-top': '1rem' }}>
                <strong>Связанные концепции:</strong>{' '}
                {modalData().relatedConcepts.join(', ')}
              </div>
            </Show>
          </div>
        </Show>
      </Modal>
    </>
  );
}

export default App;
