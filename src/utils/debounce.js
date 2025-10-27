/**
 * Debounce function - откладывает выполнение функции
 * @param {Function} func - функция для debounce
 * @param {number} wait - задержка в миллисекундах
 * @returns {Function}
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}