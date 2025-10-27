import yaml from 'js-yaml';

/**
 * Валидирует YAML frontmatter
 * @param {string} yamlText - YAML текст
 * @returns {{valid: boolean, data: Object|null, errors: Array}}
 */
export function validateYAML(yamlText) {
  if (!yamlText || yamlText.trim() === '') {
    return { valid: true, data: {}, errors: [] };
  }

  try {
    const data = yaml.load(yamlText);
    const errors = [];

    // Проверка обязательных полей
    if (!data.title) {
      errors.push({
        field: 'title',
        message: 'Поле title обязательно'
      });
    }

    return {
      valid: errors.length === 0,
      data,
      errors
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
      }]
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

  // Проверка пустого контента
  if (!contentText || contentText.trim() === '') {
    warnings.push({
      message: 'Контент документа пуст'
    });
  }

  // Проверка длины
  if (contentText && contentText.length < 100) {
    warnings.push({
      message: 'Контент слишком короткий (менее 100 символов)'
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}