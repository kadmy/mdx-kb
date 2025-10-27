/**
 * @file FrontmatterForm.jsx
 * @description Form-based редактор для YAML frontmatter.
 * Заменяет textarea на удобную форму с валидацией.
 */
import { createSignal, createEffect, For, batch } from 'solid-js';
import yaml from 'js-yaml';

/**
 * Компонент формы для редактирования frontmatter
 * @param {Object} props
 * @param {string} props.value - YAML строка frontmatter
 * @param {Function} props.onChange - Коллбэк при изменении (получает YAML строку)
 */
export function FrontmatterForm(props) {
  // Парсим YAML в объект для работы с формой
  const parseYAML = (yamlString) => {
    try {
      if (!yamlString.trim()) return {};
      return yaml.load(yamlString) || {};
    } catch (e) {
      console.error('YAML parse error:', e);
      return {};
    }
  };

  // Утилита для преобразования Date в формат yyyy-MM-dd
  const formatDateForInput = (date) => {
    if (!date) return '';
    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    }
    if (typeof date === 'string') {
      // Если уже строка, пытаемся распарсить и переформатировать
      try {
        const d = new Date(date);
        return d.toISOString().split('T')[0];
      } catch {
        return date;
      }
    }
    return '';
  };

  // Инициализация полей из props.value
  const initialData = parseYAML(props.value);

  const [title, setTitle] = createSignal(initialData.title || '');
  const [author, setAuthor] = createSignal(initialData.author || '');
  const [created, setCreated] = createSignal(formatDateForInput(initialData.created));
  const [type, setType] = createSignal(initialData.type || '');
  const [tags, setTags] = createSignal(initialData.tags || []);
  const [concepts, setConcepts] = createSignal(initialData.concepts || []);
  const [terms, setTerms] = createSignal(initialData.terms || []);

  // Временные поля для добавления новых элементов
  const [newTag, setNewTag] = createSignal('');
  const [newConcept, setNewConcept] = createSignal('');
  const [newTerm, setNewTerm] = createSignal('');

  // Флаг для предотвращения циклических обновлений
  let isUpdatingFromProps = false;

  // При изменении любого поля обновляем YAML
  createEffect(() => {
    // Не обновляем если сейчас идёт обновление от props
    if (isUpdatingFromProps) return;

    const data = {};

    if (title()) data.title = title();
    if (author()) data.author = author();
    if (created()) data.created = created();
    if (type()) data.type = type();
    if (tags().length > 0) data.tags = tags();
    if (concepts().length > 0) data.concepts = concepts();
    if (terms().length > 0) data.terms = terms();

    // Преобразуем в YAML и отправляем наверх
    const yamlString = yaml.dump(data, { lineWidth: -1 });
    props.onChange(yamlString);
  });

  // Синхронизация с внешними изменениями props.value
  createEffect(() => {
    const externalData = parseYAML(props.value);

    // Нормализуем данные для сравнения - преобразуем даты в строки
    const normalizedExternal = {
      title: externalData.title || '',
      author: externalData.author || '',
      created: formatDateForInput(externalData.created),
      type: externalData.type || '',
      tags: externalData.tags || [],
      concepts: externalData.concepts || [],
      terms: externalData.terms || [],
    };

    const currentData = {
      title: title(),
      author: author(),
      created: created(),
      type: type(),
      tags: tags(),
      concepts: concepts(),
      terms: terms(),
    };

    // Сравниваем нормализованные данные
    if (JSON.stringify(normalizedExternal) !== JSON.stringify(currentData)) {
      isUpdatingFromProps = true;

      // Используем batch для группировки всех обновлений в один цикл реактивности
      batch(() => {
        setTitle(normalizedExternal.title);
        setAuthor(normalizedExternal.author);
        setCreated(normalizedExternal.created);
        setType(normalizedExternal.type);
        setTags(normalizedExternal.tags);
        setConcepts(normalizedExternal.concepts);
        setTerms(normalizedExternal.terms);
      });

      // Сбрасываем флаг после микрозадачи
      queueMicrotask(() => {
        isUpdatingFromProps = false;
      });
    }
  });

  // Функции для работы с массивами
  const addTag = () => {
    const tag = newTag().trim();
    if (tag && !tags().includes(tag)) {
      setTags([...tags(), tag]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags().filter(t => t !== tagToRemove));
  };

  const addConcept = () => {
    const concept = newConcept().trim();
    if (concept && !concepts().includes(concept)) {
      setConcepts([...concepts(), concept]);
      setNewConcept('');
    }
  };

  const removeConcept = (conceptToRemove) => {
    setConcepts(concepts().filter(c => c !== conceptToRemove));
  };

  const addTerm = () => {
    const term = newTerm().trim();
    if (term && !terms().includes(term)) {
      setTerms([...terms(), term]);
      setNewTerm('');
    }
  };

  const removeTerm = (termToRemove) => {
    setTerms(terms().filter(t => t !== termToRemove));
  };

  return (
    <div class="frontmatter-form">
      <style>{`
        .frontmatter-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 100%;
          box-sizing: border-box;
        }
        .form-group {
          display: grid;
          grid-template-columns: clamp(120px, 18%, 160px) 1fr;
          column-gap: 0.75rem;
          row-gap: 0.5rem;
          align-items: start;
        }
        .form-group > * { min-width: 0; }
        .form-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary, #a8b5a8);
          text-align: right;
          align-self: center;
          padding-top: 2px;
        }
        .form-label.required::after {
          content: ' *';
          color: var(--accent-orange, #ff8c42);
        }
        .form-input {
          padding: 0.5rem;
          background: var(--bg-medium, #1a3a3a);
          border: 1px solid var(--border-dim, #884422);
          border-radius: 4px;
          color: var(--text-primary, #d4d9d0);
          font-size: 14px;
          font-family: inherit;
          width: 100%;
        }
        .form-input:focus {
          outline: none;
          border-color: var(--accent-orange, #ff8c42);
        }
        .form-input::placeholder {
          color: var(--text-dim, #7a8a7a);
        }
        .chips-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          padding: 0.5rem;
          background: var(--bg-medium, #1a3a3a);
          border: 1px solid var(--border-dim, #884422);
          border-radius: 4px;
          min-height: 40px;
          grid-column: 2;
          width: 100%;
          overflow-x: hidden;
        }
        .chip {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.5rem;
          background: var(--accent-green, #66cc99);
          color: var(--bg-deep, #072828);
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 500;
        }
        .chip-remove {
          background: none;
          border: none;
          color: var(--bg-deep, #072828);
          cursor: pointer;
          font-size: 1rem;
          line-height: 1;
          padding: 0;
          margin-left: 0.25rem;
        }
        .chip-remove:hover {
          color: var(--accent-orange, #ff8c42);
        }
        .add-item-container {
          display: flex;
          gap: 0.5rem;
          grid-column: 2;
          flex-wrap: nowrap;
          width: 100%;
        }
        .add-item-input {
          flex: 1 1 auto;
          min-width: 0;
        }
        .add-button {
          padding: 0.5rem 1rem;
          background: var(--accent-orange, #ff8c42);
          color: var(--bg-deep, #072828);
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.2s;
        }
        .add-button:hover {
          background: var(--page-color, #ffaa66);
        }
        .add-button:disabled {
          background: var(--bg-card, #163232);
          color: var(--text-dim, #7a8a7a);
          cursor: not-allowed;
        }
      `}</style>

      {/* Title (required) */}
      <div class="form-group">
        <label class="form-label required">Название</label>
        <input
          type="text"
          class="form-input"
          value={title()}
          onInput={(e) => setTitle(e.currentTarget.value)}
          placeholder="Название статьи"
        />
      </div>

      {/* Author */}
      <div class="form-group">
        <label class="form-label">Автор</label>
        <input
          type="text"
          class="form-input"
          value={author()}
          onInput={(e) => setAuthor(e.currentTarget.value)}
          placeholder="Имя автора"
        />
      </div>

      {/* Created Date */}
      <div class="form-group">
        <label class="form-label">Дата создания</label>
        <input
          type="date"
          class="form-input"
          value={created()}
          onInput={(e) => setCreated(e.currentTarget.value)}
        />
      </div>

      {/* Type */}
      <div class="form-group">
        <label class="form-label">Тип</label>
        <select
          class="form-input"
          value={type()}
          onChange={(e) => setType(e.currentTarget.value)}
        >
          <option value="">Выберите тип</option>
          <option value="upload">Урок</option>
          <option value="article">Статья</option>
          <option value="concept">Концепция</option>
          <option value="term">Термин</option>
        </select>
      </div>

      {/* Tags */}
      <div class="form-group">
        <label class="form-label">Теги</label>
        <div class="chips-container">
          <For each={tags()}>
            {(tag) => (
              <span class="chip">
                {tag}
                <button
                  class="chip-remove"
                  onClick={() => removeTag(tag)}
                  title="Удалить тег"
                >
                  ×
                </button>
              </span>
            )}
          </For>
        </div>
        <div class="add-item-container">
          <input
            type="text"
            class="form-input add-item-input"
            value={newTag()}
            onInput={(e) => setNewTag(e.currentTarget.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTag()}
            placeholder="Добавить тег"
          />
          <button
            class="add-button"
            onClick={addTag}
            disabled={!newTag().trim()}
          >
            + Добавить
          </button>
        </div>
      </div>

      {/* Concepts */}
      <div class="form-group">
        <label class="form-label">Концепции</label>
        <div class="chips-container">
          <For each={concepts()}>
            {(concept) => (
              <span class="chip">
                {concept}
                <button
                  class="chip-remove"
                  onClick={() => removeConcept(concept)}
                  title="Удалить концепцию"
                >
                  ×
                </button>
              </span>
            )}
          </For>
        </div>
        <div class="add-item-container">
          <input
            type="text"
            class="form-input add-item-input"
            value={newConcept()}
            onInput={(e) => setNewConcept(e.currentTarget.value)}
            onKeyDown={(e) => e.key === 'Enter' && addConcept()}
            placeholder="Добавить концепцию"
          />
          <button
            class="add-button"
            onClick={addConcept}
            disabled={!newConcept().trim()}
          >
            + Добавить
          </button>
        </div>
      </div>

      {/* Terms */}
      <div class="form-group">
        <label class="form-label">Термины</label>
        <div class="chips-container">
          <For each={terms()}>
            {(term) => (
              <span class="chip">
                {term}
                <button
                  class="chip-remove"
                  onClick={() => removeTerm(term)}
                  title="Удалить термин"
                >
                  ×
                </button>
              </span>
            )}
          </For>
        </div>
        <div class="add-item-container">
          <input
            type="text"
            class="form-input add-item-input"
            value={newTerm()}
            onInput={(e) => setNewTerm(e.currentTarget.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTerm()}
            placeholder="Добавить термин"
          />
          <button
            class="add-button"
            onClick={addTerm}
            disabled={!newTerm().trim()}
          >
            + Добавить
          </button>
        </div>
      </div>
    </div>
  );
}
