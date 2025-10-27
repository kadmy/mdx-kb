/**
 * @file FrontmatterForm.jsx
 * @description Form-based редактор для YAML frontmatter.
 * Заменяет textarea на удобную форму с валидацией.
 * Финальная схема согласно "Проект Ковчег": метаданные + фасеты.
 */
import { createSignal, createEffect, batch, untrack } from 'solid-js';
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

  // === 1. Основные Метаданные ===
  const [title, setTitle] = createSignal(initialData.title || '');
  const [description, setDescription] = createSignal(initialData.description || '');
  const [date, setDate] = createSignal(formatDateForInput(initialData.date));
  const [draft, setDraft] = createSignal(initialData.draft !== undefined ? initialData.draft : false);

  // === 2. Организационные Фасеты ===
  const [contentType, setContentType] = createSignal(initialData.content_type || '');
  const [level, setLevel] = createSignal(initialData.level || '');
  const [series, setSeries] = createSignal(initialData.series || '');
  const [part, setPart] = createSignal(initialData.part ? String(initialData.part) : '');
  const [origin, setOrigin] = createSignal(initialData.origin || '');

  // Флаг для предотвращения циклических обновлений
  let isUpdatingFromProps = false;

  // При изменении любого поля обновляем YAML
  createEffect(() => {
    // Не обновляем если сейчас идёт обновление от props
    if (isUpdatingFromProps) return;

    const data = {};

    // === 1. Основные Метаданные ===
    if (title()) data.title = title();
    if (description()) data.description = description();
    if (date()) data.date = date();
    data.draft = draft(); // всегда включаем draft (boolean)

    // === 2. Организационные Фасеты ===
    if (contentType()) data.content_type = contentType();
    if (level()) data.level = level();
    if (series()) data.series = series();
    if (part() && part().trim()) {
      const partNum = parseInt(part(), 10);
      if (!isNaN(partNum) && partNum > 0) {
        data.part = partNum;
      }
    }
    if (origin()) data.origin = origin();

    // Преобразуем в YAML и отправляем наверх
    const yamlString = yaml.dump(data, { lineWidth: -1, sortKeys: false });
    props.onChange(yamlString);
  });

  // Синхронизация с внешними изменениями props.value
  createEffect(() => {
    const externalData = parseYAML(props.value);

    // Нормализуем данные для сравнения
    const normalizedExternal = {
      title: externalData.title || '',
      description: externalData.description || '',
      date: formatDateForInput(externalData.date),
      draft: externalData.draft !== undefined ? externalData.draft : false,
      content_type: externalData.content_type || '',
      level: externalData.level || '',
      series: externalData.series || '',
      part: externalData.part ? String(externalData.part) : '',
      origin: externalData.origin || '',
    };

    // Используем untrack для чтения текущих значений без создания зависимостей
    const currentData = untrack(() => ({
      title: title(),
      description: description(),
      date: date(),
      draft: draft(),
      content_type: contentType(),
      level: level(),
      series: series(),
      part: part(),
      origin: origin(),
    }));

    // Сравниваем нормализованные данные
    if (JSON.stringify(normalizedExternal) !== JSON.stringify(currentData)) {
      isUpdatingFromProps = true;

      // Используем batch для группировки всех обновлений в один цикл реактивности
      batch(() => {
        setTitle(normalizedExternal.title);
        setDescription(normalizedExternal.description);
        setDate(normalizedExternal.date);
        setDraft(normalizedExternal.draft);
        setContentType(normalizedExternal.content_type);
        setLevel(normalizedExternal.level);
        setSeries(normalizedExternal.series);
        setPart(normalizedExternal.part);
        setOrigin(normalizedExternal.origin);
      });

      // Сбрасываем флаг после микрозадачи
      queueMicrotask(() => {
        isUpdatingFromProps = false;
      });
    }
  });

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

      {/* === 1. ОСНОВНЫЕ МЕТАДАННЫЕ === */}

      {/* Title (required) */}
      <div class="form-group">
        <label class="form-label required">Название</label>
        <input
          type="text"
          class="form-input"
          value={title()}
          onInput={(e) => setTitle(e.currentTarget.value)}
          placeholder="Завет Авраама: Основание веры"
        />
      </div>

      {/* Description */}
      <div class="form-group">
        <label class="form-label">Описание</label>
        <textarea
          class="form-input"
          value={description()}
          onInput={(e) => setDescription(e.currentTarget.value)}
          placeholder="Краткое описание для SEO и превью"
          rows="3"
          style="resize: vertical; font-family: inherit;"
        />
      </div>

      {/* Date */}
      <div class="form-group">
        <label class="form-label">Дата</label>
        <input
          type="date"
          class="form-input"
          value={date()}
          onInput={(e) => setDate(e.currentTarget.value)}
        />
      </div>

      {/* Draft */}
      <div class="form-group">
        <label class="form-label">Черновик</label>
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
          <input
            type="checkbox"
            checked={draft()}
            onInput={(e) => setDraft(e.currentTarget.checked)}
            style="width: 18px; height: 18px; cursor: pointer;"
          />
          <span style="font-size: 0.9rem; color: var(--text-secondary);">
            Не публиковать (черновик)
          </span>
        </label>
      </div>

      {/* === 2. ОРГАНИЗАЦИОННЫЕ ФАСЕТЫ === */}

      {/* Content Type */}
      <div class="form-group" style="margin-top: 1.5rem;">
        <label class="form-label">Тип контента</label>
        <select
          class="form-input"
          value={contentType()}
          onInput={(e) => setContentType(e.currentTarget.value)}
        >
          <option value="">Выберите тип</option>
          <option value="study">Исследование</option>
          <option value="lecture">Лекция</option>
          <option value="exegesis">Экзегетика</option>
          <option value="reference">Справочник</option>
          <option value="analysis">Анализ/Синтез</option>
          <option value="qa">Вопрос-Ответ</option>
        </select>
      </div>

      {/* Level */}
      <div class="form-group">
        <label class="form-label">Уровень сложности</label>
        <select
          class="form-input"
          value={level()}
          onInput={(e) => setLevel(e.currentTarget.value)}
        >
          <option value="">Выберите уровень</option>
          <option value="level_1_beginner">Уровень 1: Для начинающих</option>
          <option value="level_2_foundational">Уровень 2: Основы</option>
          <option value="level_3_deep_dive">Уровень 3: Глубокое изучение</option>
          <option value="level_4_academic">Уровень 4: Академический</option>
        </select>
      </div>

      {/* Series */}
      <div class="form-group">
        <label class="form-label">Серия</label>
        <input
          type="text"
          class="form-input"
          value={series()}
          onInput={(e) => setSeries(e.currentTarget.value)}
          placeholder="Основы Завета (опционально)"
        />
      </div>

      {/* Part */}
      <div class="form-group">
        <label class="form-label">Часть серии</label>
        <input
          type="number"
          class="form-input"
          value={part()}
          onInput={(e) => setPart(e.currentTarget.value)}
          placeholder="1, 2, 3... (опционально)"
          min="1"
        />
      </div>

      {/* Origin */}
      <div class="form-group">
        <label class="form-label">Происхождение</label>
        <select
          class="form-input"
          value={origin()}
          onInput={(e) => setOrigin(e.currentTarget.value)}
        >
          <option value="">Выберите происхождение</option>
          <option value="origin_systematic">Систематизированное</option>
          <option value="origin_transcript_derived">Из транскрипции</option>
          <option value="origin_community_note">Заметка общины</option>
        </select>
      </div>
    </div>
  );
}
