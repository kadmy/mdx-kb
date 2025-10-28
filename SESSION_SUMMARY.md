# Итоговый документ сессии разработки MDX Knowledge Base

**Дата**: 28 октября 2025
**Проект**: Ковчег - MDX Knowledge Base
**Ветка**: `claude/explore-mdx-structure-011CUY7MRWiS7BSjWDdiKGXz`

---

## 1. Начальный контекст и выбор подхода

### Исходная задача
Продолжение работы над проектом MDX Knowledge Base для систематизации знаний в области библейского богословия. Проект использует:
- **SolidJS** 1.9.9 (реактивный UI фреймворк)
- **MDX** (Markdown + JSX компоненты)
- **Monaco Editor** (VS Code редактор)
- **Runtime MDX компиляция** с live preview

### Варианты подхода к автодополнению компонентов

Рассматривались три варианта:

#### Вариант A: Monaco встроенное автодополнение (ВЫБРАН → ОТКЛОНЁН)
**Изначально выбран**, но столкнулись с критическими проблемами:
- ❌ Автозакрытие тегов `<>` вызывало ошибки MDX компиляции
- ❌ Неполные теги (`<Bib`) немедленно вызывали ошибки парсинга
- ❌ Trigger characters конфликтовали с MDX синтаксисом
- ❌ `Ctrl+Space` показывал "Loading..." без результата
- ❌ Monaco suggest widget обрезался родительскими контейнерами

**Вывод**: Monaco встроенное автодополнение несовместимо с MDX workflow из-за конфликта между незавершённым синтаксисом и runtime компиляцией.

#### Вариант B: Custom UI кнопка с меню (РЕАЛИЗОВАН ✅)
**Финальное решение** после отказа от варианта A:
- ✅ Кнопка слева от редактора при курсоре в начале строки
- ✅ Меню с русскими описаниями компонентов (не латинскими именами)
- ✅ Portal рендеринг для избежания clipping
- ✅ Умное позиционирование с учётом границ viewport
- ✅ Прямая вставка через `editor.executeEdits()`
- ✅ Никаких конфликтов с MDX компиляцией

#### Вариант C: Snippet панель (НЕ РЕАЛИЗОВАН)
Отложен, так как вариант B оказался достаточным.

---

## 2. Реализованные компоненты и функции

### 2.1 MDX Компоненты (16 штук)

#### Inline компоненты (5)
1. **OriginalWord** - слова на иврите/греческом с транслитерацией
2. **PersonRef** - ссылки на персон из knowledge graph
3. **ScriptureRef** - ссылки на стихи Писания
4. **PlaceRef** - ссылки на географические места
5. **SourceRef** - ссылки на исторические источники

#### Блочные компоненты (5)
1. **BibleVerse** - цитаты из Писания с переводом
2. **Definition** - определения терминов
3. **Callout** - заметки/предупреждения с типами (info, interpretation, warning, etc.)
4. **JewishContext** - объяснения в еврейском контексте
5. **Ritual** - описания ритуалов и практик

#### Структурные компоненты (5)
1. **ArgumentSection** - секции аргументации с тезисом
2. **SupportPoint** - доводы в поддержку тезиса
3. **CounterArgument** - контраргументы
4. **Rebuttal** - опровержения контраргументов
5. **Synthesis** - итоговые заключения

#### Компоненты управления знаниями (1)
1. **KnowledgeFragment** - фрагменты "распределённого знания" для RAG системы
   - 9 аспектов: etymological, definition, application, problem, polemic, comparative, interpretation, historical, theological
   - Визуальная дифференциация по цветам и иконкам
   - Data-атрибуты для индексации

### 2.2 Система вставки компонентов

#### ComponentInsertButton.jsx
- **Позиционирование**: Кнопка 24x24px слева от редактора (-30px) при `column === 1`
- **Реактивность**: `createEffect` на `editor.onDidChangeCursorPosition`
- **Меню**: 4 категории с русскими названиями
  - "Inline компоненты" (5 items)
  - "Блочные компоненты" (5 items)
  - "Структурные компоненты" (5 items)
  - "Управление знаниями" (1 item)
- **Portal**: Рендеринг через `Portal` из `solid-js/web` для избежания clipping
- **Умное позиционирование**:
  ```javascript
  const menuWidth = menuRef?.offsetWidth || 320;
  const menuHeight = menuRef?.offsetHeight || 500;

  // Справа не помещается → показать слева
  if (left + menuWidth > viewportWidth) {
    left = btnPos.left - menuWidth - 5;
  }

  // Снизу не помещается → сместить вверх
  if (menuHeight > spaceBelow - padding) {
    top = top - (menuHeight - spaceBelow) - padding;
  }
  ```
- **Resize handler**: Пересчёт позиции при изменении размера окна
- **Стилизация**: Согласована с темой (bg-medium, border-dim, scrollbar-color)

### 2.3 Метаданные и валидация

#### Финальная схема frontmatter
```yaml
# Основные метаданные
title: string (required)
description: string (рекомендуется для SEO)
date: yyyy-MM-dd (optional)
draft: boolean (optional, default: false)

# Организационные фасеты
content_type: study | lecture | exegesis | reference | analysis | qa (рекомендуется)
level: level_1_beginner | level_2_foundational | level_3_deep_dive | level_4_academic
series: string (optional)
part: number (optional)
origin: origin_systematic | origin_transcript_derived | origin_community_note
```

#### Валидация (validator.js)
- **Ошибки**: Обязательные поля, типы данных, допустимые значения фасетов
- **Предупреждения**: Отсутствие description (SEO), отсутствие content_type (фасетная навигация)
- **Интеграция**: ValidationPanel показывает ошибки/предупреждения в реальном времени

#### FrontmatterForm.jsx
- **Form-based редактор** вместо сырого YAML
- **Двунаправленная синхронизация**:
  - Props → Form: через `createEffect` на `props.value`
  - Form → Props: через `createEffect` на все поля + `props.onChange`
- **Флаг `isUpdatingFromProps`**: Предотвращает циклические обновления
- **Batch updates**: Группировка изменений для эффективности

---

## 3. Архитектурные решения и паттерны

### 3.1 Реактивность в SolidJS

#### Signals vs Effects
```javascript
// Signal для хранения состояния
const [editorInstance, setEditorInstance] = createSignal(null);

// Effect для побочных эффектов
createEffect(() => {
  const editor = props.editor;
  if (!editor) return;

  const disposable = editor.onDidChangeCursorPosition(updatePosition);
  onCleanup(() => disposable?.dispose());
});
```

#### Порядок выполнения с batch()
```javascript
batch(() => {
  setTitle(newTitle);
  setSeries(newSeries);
  // ... другие updates
});
// batch() откладывает выполнение effects до конца
isUpdatingFromProps = false; // Сбросить флаг СИНХРОННО
// Теперь effects запускаются с правильным значением флага
```

**Критический инсайт**: `queueMicrotask()` для сброса флага был СЛИШКОМ ПОЗДНО. Флаг нужно сбрасывать синхронно после `batch()`, но ДО того как batch завершится.

### 3.2 Monaco Editor интеграция

#### Получение editor instance
```javascript
// В handleEditorMount только monaco доступен
const handleEditorMount = (monaco) => {
  monaco.editor.defineTheme('cook-theme', cookTheme);
  monaco.editor.setTheme('cook-theme');

  // Получить editor через API
  setTimeout(() => {
    const editors = monaco.editor.getEditors();
    if (editors && editors.length > 0) {
      setEditorInstance(editors[0]);
    }
  }, 100);
};
```

#### Вставка текста
```javascript
const insertComponent = (snippet) => {
  const position = editor.getPosition();
  editor.executeEdits('insert-component', [{
    range: {
      startLineNumber: position.lineNumber,
      startColumn: position.column,
      endLineNumber: position.lineNumber,
      endColumn: position.column,
    },
    text: snippet,
  }]);
  editor.focus();
};
```

#### Позиционирование элементов
```javascript
const coords = editor.getScrolledVisiblePosition(position);
const domNode = editor.getDomNode();
const editorRect = domNode.getBoundingClientRect();

const absoluteTop = coords.top + editorRect.top;
const absoluteLeft = editorRect.left - 30; // Слева от редактора
```

### 3.3 MDX Runtime компиляция

#### Избежание ошибок с неполными тегами
- ❌ **НЕ РАБОТАЕТ**: Trigger characters `<` → немедленная компиляция с `<Bib` → ошибка
- ✅ **РАБОТАЕТ**: Вставка полных компонентов `<BibleVerse...></BibleVerse>` → валидный MDX

#### Debounced компиляция
```javascript
const debouncedCompile = debounce(async () => {
  setIsCompiling(true);
  const result = await compileMDX(fullMDX, components);

  if (result.error) {
    setCompileError(result.error);
  } else {
    setCompiledComponent(() => result.Component);
  }

  setIsCompiling(false);
}, 500);
```

### 3.4 Сохранение и загрузка

#### Нормализация данных
```javascript
// При загрузке: распарсить frontmatter → нормализовать → установить в signals
const { content, data: fmData } = matter(data.content);
const normalizedData = {
  title: fmData?.title,
  description: fmData?.description,
  date: normalizeDate(fmData?.date), // yyyy-MM-dd
  draft: fmData?.draft !== undefined ? fmData.draft : false,
  content_type: fmData?.content_type,
  // ... и т.д.
};
const normalizedYaml = yaml.dump(normalizedData, { lineWidth: -1 });
setFrontmatterText(normalizedYaml);
```

#### Обнаружение несохранённых изменений
```javascript
const normalizeFull = (fullText) => {
  const parsed = matter(fullText || '');
  const stableYaml = yaml.dump(parsed.data || {}, { lineWidth: -1 });
  return `---\n${stableYaml.trim()}\n---\n\n${parsed.content}`;
};

const hasUnsavedChanges = () => {
  const current = normalizeFull(buildFullContent());
  const original = normalizeFull(originalContent());
  return current !== original;
};
```

### 3.5 Portal для UI элементов

```javascript
import { Portal } from 'solid-js/web'; // НЕ из 'solid-js'!

<Portal>
  <Show when={showMenu()}>
    <div style={{ position: 'fixed', ... }}>
      {/* Меню рендерится в body, не внутри родителя */}
    </div>
  </Show>
</Portal>
```

**Преимущества**:
- Избегает `overflow: hidden` родительских контейнеров
- Корректное позиционирование относительно viewport
- z-index работает предсказуемо

---

## 4. Ключевые проблемы и их решения

### 4.1 Monaco автодополнение несовместимо с MDX

**Проблема**:
- Typing `<` → Monaco вставляет `>` → `<>` → MDX ошибка
- Typing `<Bib` → trigger suggests → MDX пытается компилировать → ошибка
- quickSuggestions / triggerCharacters конфликтуют с runtime компиляцией

**Решение**:
Полный отказ от Monaco встроенного автодополнения. Custom UI кнопка с меню.

**Ключевой инсайт**:
Runtime компиляция требует **только валидного синтаксиса** в редакторе. Любая система автодополнения, которая создаёт невалидный промежуточный синтаксис, несовместима с MDX.

### 4.2 Форма не загружала данные из файла

**Проблема**:
```
1. FrontmatterForm INIT - props.value: '' (пустой!)
2. === APP LOADING FILE ===
3. ✓ Set frontmatterText to: '...' (с данными)
```
Форма инициализировалась **до** загрузки данных из файла.

**Первая попытка решения**:
Второй `createEffect` для синхронизации `props.value` → form fields. Но не работал из-за флага `isUpdatingFromProps`.

**Проблема с флагом**:
```javascript
// ❌ НЕПРАВИЛЬНО
batch(() => { setSeries(...); });
queueMicrotask(() => { isUpdatingFromProps = false; }); // Слишком поздно!

// Первый createEffect запускается с isUpdatingFromProps = true
// и сразу выходит через return
```

**Решение**:
```javascript
// ✅ ПРАВИЛЬНО
batch(() => { setSeries(...); });
isUpdatingFromProps = false; // Сбросить синхронно!

// batch() откладывает effects, но флаг уже false
// Первый createEffect запускается и обновляет YAML
```

**Ключевой инсайт**:
В SolidJS `batch()` откладывает выполнение effects до своего завершения. Флаг нужно сбрасывать синхронно после изменения signals, но внутри области видимости batch (до его завершения).

### 4.3 Меню обрезалось по границам

**Проблема**:
Меню рендерилось внутри `.collapsible-content` с `overflow: hidden` → обрезалось.

**Решение**:
- Portal рендеринг в body
- Реальная высота через `menuRef.offsetHeight`
- Умное позиционирование с учётом viewport границ

**Ключевой инсайт**:
Для popover/dropdown элементов ВСЕГДА использовать Portal + fixed positioning относительно viewport.

### 4.4 Загрузка использовала старые поля схемы

**Проблема**:
```javascript
// ❌ Старые поля
if (fmData?.author) normalizedData.author = fmData.author;
if (fmData?.type) normalizedData.type = fmData.type;
```

**Решение**:
```javascript
// ✅ Новые поля финальной схемы
if (fmData?.description) normalizedData.description = fmData.description;
if (fmData?.content_type) normalizedData.content_type = fmData.content_type;
```

**Ключевой инсайт**:
При изменении схемы данных нужно обновлять **ВСЕ** места: validator, form, loading, saving.

---

## 5. Важные инсайты для дальнейшей разработки

### 5.1 SolidJS реактивность

1. **Порядок выполнения важен**: Effects запускаются в порядке их определения в коде
2. **batch() откладывает, не группирует**: Все изменения внутри batch откладываются до конца
3. **Флаги синхронизации**: Сбрасывать синхронно, не через queueMicrotask
4. **untrack() для чтения**: Использовать для чтения значений без создания зависимостей

### 5.2 Monaco Editor

1. **onMount дает только monaco**: Editor instance получать через `monaco.editor.getEditors()`
2. **Positioning требует координат**: `getScrolledVisiblePosition()` + `getBoundingClientRect()`
3. **executeEdits для вставки**: Не пытаться манипулировать value напрямую
4. **autoClosing отключать**: `autoClosingBrackets: 'never'` для MDX

### 5.3 MDX компиляция

1. **Runtime требует валидности**: Нельзя иметь невалидный синтаксис даже временно
2. **Debounce обязателен**: 500ms debounce для экономии ресурсов
3. **Компоненты lowercase**: MDX создаёт lowercase варианты автоматически
4. **Frontmatter парсинг**: Использовать `gray-matter` для разделения

### 5.4 Форма метаданных

1. **Двунаправленная синхронизация**: Props → Form и Form → Props через отдельные effects
2. **Флаг против циклов**: `isUpdatingFromProps` предотвращает ping-pong
3. **Batch для группировки**: Обновлять все поля в одном batch
4. **Нормализация данных**: Приводить к единому формату для сравнения

### 5.5 Portal и позиционирование

1. **Portal из web**: `import { Portal } from 'solid-js/web'`
2. **fixed + viewport**: Позиционировать относительно viewport, не родителя
3. **Реальные размеры**: Использовать `offsetWidth/offsetHeight` из ref
4. **Resize handler**: Пересчитывать при изменении окна

---

## 6. Текущая архитектура

### Структура компонентов

```
App.jsx (корень)
├── ValidationPanel (ошибки/предупреждения)
├── FrontmatterForm (метаданные)
│   ├── Поля: title, description, date, draft
│   └── Фасеты: content_type, level, series, part, origin
├── MonacoEditor (редактор контента)
│   └── ComponentInsertButton (Portal)
│       ├── Кнопка (+)
│       └── Меню с категориями (Portal)
└── ErrorBoundary > Preview (скомпилированный MDX)
    └── MDX Components (16 компонентов)

Modal (отдельное дерево)
└── Concept/Term details
```

### Поток данных

```
1. Загрузка файла:
   fetch('/api/load')
   → matter(content)
   → нормализация
   → setFrontmatterText()
   → setEditorContent()

2. Редактирование frontmatter:
   FrontmatterForm поле меняется
   → createEffect срабатывает
   → yaml.dump()
   → props.onChange(yamlString)
   → setFrontmatterText() в App
   → валидация
   → компиляция MDX

3. Редактирование контента:
   MonacoEditor onChange
   → setEditorContent()
   → валидация
   → debounced компиляция MDX

4. Вставка компонента:
   Курсор в column 1
   → кнопка показывается
   → клик на меню item
   → editor.executeEdits()
   → onChange → компиляция

5. Сохранение:
   buildFullContent()
   → fetch('/api/save', { content })
   → setOriginalContent()
```

### API endpoints (vite.config.mjs)

```javascript
GET /api/load
→ fs.readFileSync('src/content.mdx')
→ { content: string }

POST /api/save
body: { content: string }
→ fs.writeFileSync('src/content.mdx', content)
→ { success: true }
```

---

## 7. Следующие шаги и направления развития

### 7.1 Краткосрочные улучшения

1. **Убрать debug логирование**
   - Файлы: `App.jsx`, `FrontmatterForm.jsx`
   - Оставить только критические логи (errors)

2. **Добавить keyboard shortcuts**
   - `Ctrl+S` → сохранить
   - `Ctrl+Space` в начале строки → открыть меню компонентов
   - `Esc` → закрыть меню

3. **Улучшить предпросмотр вставки**
   - Preview snippet при hover над menu item
   - Показывать пример использования компонента

4. **Добавить поиск в меню компонентов**
   - Фильтрация по русским названиям
   - Fuzzy search для быстрого доступа

### 7.2 Среднесрочные задачи

1. **Knowledge Graph интеграция**
   - Автодополнение для `personKey`, `placeKey` в компонентах
   - Валидация существования referenced entities
   - Визуализация связей в preview

2. **Расширенная валидация MDX**
   - Проверка вложенности компонентов
   - Валидация обязательных props
   - Предупреждения о deprecated patterns

3. **Улучшенный preview**
   - Side-by-side режим с синхронной прокруткой
   - Outline/TOC для навигации
   - Breadcrumbs для структурных компонентов

4. **История изменений**
   - Local storage для undo/redo
   - Diff view для сравнения версий
   - Auto-save drafts

### 7.3 Долгосрочная стратегия

1. **Multi-file editing**
   - Навигация между файлами знаний
   - Поиск по всему корпусу
   - Cross-file references validation

2. **Collaborative features**
   - Real-time collaboration (optional)
   - Comments и annotations
   - Review/approval workflow

3. **RAG система**
   - Индексация KnowledgeFragment компонентов
   - Semantic search по содержимому
   - AI-assisted content suggestions

4. **Export/Import**
   - Export в PDF, DOCX
   - Import из различных форматов
   - Batch operations

### 7.4 Технический долг

1. **Testing**
   - Unit tests для компонентов (Vitest)
   - Integration tests для workflow
   - E2E tests для критических путей (Playwright)

2. **Performance**
   - Lazy loading компонентов в меню
   - Virtual scrolling для больших документов
   - Web Workers для компиляции MDX

3. **Accessibility**
   - Keyboard navigation по всему UI
   - Screen reader support
   - ARIA attributes для custom элементов

4. **Documentation**
   - User guide для авторов контента
   - Component API reference
   - Architecture diagrams

---

## 8. Полезные команды и ссылки

### Команды

```bash
# Запуск dev сервера
npm run dev

# Build production
npm run build

# Preview production build
npm run preview

# Работа с git
git status
git add -A
git commit -m "message"
git push -u origin claude/explore-mdx-structure-011CUY7MRWiS7BSjWDdiKGXz

# Pull с rebase (при конфликтах)
git pull origin claude/explore-mdx-structure-011CUY7MRWiS7BSjWDdiKGXz --rebase
```

### Ключевые файлы

```
src/
├── App.jsx                          # Главный компонент приложения
├── content.mdx                      # Пример контента
├── components/
│   ├── FrontmatterForm.jsx          # Форма метаданных
│   ├── ComponentInsertButton.jsx    # Кнопка вставки компонентов
│   ├── ValidationPanel.jsx          # Панель валидации
│   ├── mdx-components.js            # Экспорт всех MDX компонентов
│   ├── KnowledgeFragment.jsx        # RAG компонент
│   └── [14 других MDX компонентов]
├── services/
│   ├── mdx-compiler.js              # Runtime компиляция MDX
│   └── validator.js                 # Валидация frontmatter и контента
└── utils/
    ├── monaco-theme.js              # Тема Cook для Monaco
    └── debounce.js                  # Debounce utility

vite.config.mjs                      # Конфигурация + API endpoints
```

### Документация

- **SolidJS**: https://www.solidjs.com/docs/latest
- **MDX**: https://mdxjs.com/
- **Monaco Editor**: https://microsoft.github.io/monaco-editor/
- **gray-matter**: https://github.com/jonschlinkert/gray-matter
- **js-yaml**: https://github.com/nodeca/js-yaml

---

## 9. Заключение

### Достижения сессии

✅ **16 MDX компонентов** для структурирования теологического контента
✅ **Custom UI система** вставки компонентов (заменила неработающее Monaco автодополнение)
✅ **Умное позиционирование** меню с учётом viewport границ
✅ **Финальная схема метаданных** с валидацией и warnings
✅ **Двунаправленная синхронизация** формы метаданных
✅ **Исправлены критические баги** сохранения и загрузки

### Ключевые технические решения

1. **Portal + fixed positioning** для UI элементов поверх editor
2. **Синхронный сброс флагов** для корректной SolidJS реактивности
3. **batch() для группировки** множественных изменений signals
4. **Нормализация данных** для надёжного обнаружения изменений
5. **Полный отказ от Monaco suggest** в пользу custom UI

### Технические знания для продолжения

- **SolidJS реактивность**: порядок effects, batch, untrack, cleanup
- **Monaco Editor API**: getEditors, executeEdits, positioning
- **MDX компиляция**: требование валидности, debouncing
- **Portal паттерн**: когда использовать, как позиционировать
- **Синхронизация форм**: флаги, batch, timing

---

**Статус проекта**: Основной функционал реализован и работает стабильно. Готов к продолжению разработки и добавлению новых фич.

**Следующий приоритет**: Убрать debug логирование → добавить keyboard shortcuts → интеграция Knowledge Graph.
