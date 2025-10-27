import yaml from 'js-yaml';

// Допустимые значения для фасетов
const VALID_CONTENT_TYPES = ['study', 'lecture', 'exegesis', 'reference', 'analysis', 'qa'];
const VALID_LEVELS = ['level_1_beginner', 'level_2_foundational', 'level_3_deep_dive', 'level_4_academic'];
const VALID_ORIGINS = ['origin_systematic', 'origin_transcript_derived', 'origin_community_note'];

/**
 * Валидирует YAML frontmatter согласно финальной схеме "Проект Ковчег"
 * @param {string} yamlText - YAML текст
 * @returns {{valid: boolean, data: Object|null, errors: Array, warnings: Array}}
 */
export function validateYAML(yamlText) {
  if (!yamlText || yamlText.trim() === '') {
    return { valid: true, data: {}, errors: [], warnings: [] };
  }

  try {
    const data = yaml.load(yamlText);
    const errors = [];
    const warnings = [];

    // === 1. Обязательные поля ===
    if (!data.title || typeof data.title !== 'string' || data.title.trim() === '') {
      errors.push({
        field: 'title',
        message: 'Поле title обязательно и должно быть непустой строкой'
      });
    }

    // === 2. Метаданные (опциональные, но с проверкой типов) ===
    if (data.description !== undefined && typeof data.description !== 'string') {
      errors.push({
        field: 'description',
        message: 'Поле description должно быть строкой'
      });
    }

    if (data.date !== undefined) {
      // Проверяем формат даты yyyy-MM-dd
      if (typeof data.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
        errors.push({
          field: 'date',
          message: 'Поле date должно быть в формате yyyy-MM-dd'
        });
      }
    }

    if (data.draft !== undefined && typeof data.draft !== 'boolean') {
      errors.push({
        field: 'draft',
        message: 'Поле draft должно быть boolean (true/false)'
      });
    }

    // === 3. Фасеты (опциональные, но с проверкой допустимых значений) ===
    if (data.content_type !== undefined) {
      if (!VALID_CONTENT_TYPES.includes(data.content_type)) {
        errors.push({
          field: 'content_type',
          message: `Недопустимое значение content_type. Допустимые: ${VALID_CONTENT_TYPES.join(', ')}`
        });
      }
    }

    if (data.level !== undefined) {
      if (!VALID_LEVELS.includes(data.level)) {
        errors.push({
          field: 'level',
          message: `Недопустимое значение level. Допустимые: ${VALID_LEVELS.join(', ')}`
        });
      }
    }

    if (data.origin !== undefined) {
      if (!VALID_ORIGINS.includes(data.origin)) {
        errors.push({
          field: 'origin',
          message: `Недопустимое значение origin. Допустимые: ${VALID_ORIGINS.join(', ')}`
        });
      }
    }

    if (data.series !== undefined && typeof data.series !== 'string') {
      errors.push({
        field: 'series',
        message: 'Поле series должно быть строкой'
      });
    }

    if (data.part !== undefined) {
      if (typeof data.part !== 'number' || data.part < 1 || !Number.isInteger(data.part)) {
        errors.push({
          field: 'part',
          message: 'Поле part должно быть целым положительным числом'
        });
      }
    }

    // === 4. Предупреждения ===
    if (!data.description || data.description.trim() === '') {
      warnings.push({
        field: 'description',
        message: 'Рекомендуется добавить описание для SEO'
      });
    }

    if (!data.content_type) {
      warnings.push({
        field: 'content_type',
        message: 'Рекомендуется указать тип контента для фасетной навигации'
      });
    }

    return {
      valid: errors.length === 0,
      data,
      errors,
      warnings
    };
  } catch (error) {
    return {
      valid: false,
      data: null,
      errors: [{
        field: 'yaml',
        message: `Ошибка парсинга YAML: ${error.message}`,
        line: error.mark?.line,
        column: error.mark?.column
      }],
      warnings: []
    };
  }
}

/**
 * Валидирует полный MDX файл (frontmatter + content)
 * @param {string} frontmatterText
 * @param {string} contentText
 * @returns {{valid: boolean, errors: Array, warnings: Array}}
 */
export function validateFullDocument(frontmatterText, contentText) {
  const errors = [];
  const warnings = [];

  // Валидация YAML
  const yamlResult = validateYAML(frontmatterText);
  if (!yamlResult.valid) {
    errors.push(...yamlResult.errors);
  }
  // Добавляем warnings из YAML валидации
  if (yamlResult.warnings && yamlResult.warnings.length > 0) {
    warnings.push(...yamlResult.warnings);
  }

  // Проверка пустого контента
  if (!contentText || contentText.trim() === '') {
    warnings.push({
      field: 'content',
      message: 'Контент документа пуст'
    });
  }

  // Проверка длины
  if (contentText && contentText.length < 100) {
    warnings.push({
      field: 'content',
      message: 'Контент слишком короткий (менее 100 символов)'
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}