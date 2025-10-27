/**
 * @file terms.js
 * @description Единый источник данных для всех терминов базы знаний.
 * Структура подготовлена для будущей миграции в БД.
 */

/**
 * @typedef {Object} Term
 * @property {string} definition - Основное определение термина
 * @property {string} [etymology] - Этимология (происхождение слова)
 * @property {string} category - Категория термина
 * @property {string[]} [relatedConcepts] - Связанные концепции
 * @property {string[]} [examples] - Примеры использования
 */

/**
 * Словарь терминов базы знаний.
 * @type {Object.<string, Term>}
 */
export const TERMS = {
  // ==================== ЕВРЕЙСКИЕ ТЕРМИНЫ ====================

  'мишпат': {
    definition: 'Справедливость, правосудие',
    etymology: 'Евр. מִשְׁפָּט',
    category: 'Еврейские термины',
    relatedConcepts: ['pravda', 'tsedaka'],
  },

  'цдака': {
    definition: 'Праведность в оценке Всевышнего',
    etymology: 'Евр. צְדָקָה',
    category: 'Еврейские термины',
    relatedConcepts: ['mishpat'],
  },

  'хесед': {
    definition: 'Милость, неравнодушие',
    etymology: 'Евр. חֶסֶד',
    category: 'Еврейские термины',
    relatedConcepts: [],
  },

  'моадим': {
    definition: 'Установленные времена Встречи со Всевышним, каждое в своем контексте',
    etymology: 'Евр. מוֹעֲדִים',
    category: 'Еврейские термины',
    relatedConcepts: ['zamysel-vsevyshnego'],
  },

  'тшува': {
    definition: 'Возвращение к жизни в замысле Всевышнего',
    etymology: 'Евр. תְּשׁוּבָה',
    category: 'Еврейские термины',
    relatedConcepts: ['zamysel-vsevyshnego', 'spasenie'],
  },

  'решит': {
    definition: 'Главное в замысле. Начало чего-либо',
    etymology: 'Евр. רֵאשִׁית',
    category: 'Еврейские термины',
    relatedConcepts: ['zamysel-vsevyshnego'],
  },

  'нахаш': {
    definition: 'Духовная сущность, отвечавшая изначально за силу воображения, пользующаяся своим инструментом не по назначению',
    etymology: 'Евр. נָחָשׁ',
    category: 'Еврейские термины',
    relatedConcepts: ['voobrazhenie', 'greh'],
  },

  'йешуа': {
    definition: 'Имя, содержащее в себе смысл Спасения',
    etymology: 'Евр. יֵשׁוּעַ',
    category: 'Еврейские термины',
    relatedConcepts: ['spasenie', 'logos'],
  },

  'иври': {
    definition: 'Букв. "перешедший". Тот, кто перешел на сторону Творца',
    etymology: 'Евр. עִבְרִי',
    category: 'Еврейские термины',
    relatedConcepts: ['tshuvа', 'zamysel-vsevyshnego'],
  },

  'афар': {
    definition: 'Прах, пыль, символ ничтожности и смирения',
    etymology: 'Евр. עָפָר',
    category: 'Еврейские термины',
    relatedConcepts: ['smert', 'padenie'],
  },

  'дмут': {
    definition: 'Подобие / образ',
    etymology: 'Евр. דְּמוּת',
    category: 'Еврейские термины',
    relatedConcepts: ['podbobiye', 'zamysel-vsevyshnego'],
  },

  // ==================== МИСТИЧЕСКИЕ КОНЦЕПЦИИ ====================

  'эден': {
    definition: 'Сад духовной жизни, место соединения с Всевышним',
    etymology: 'Евр. עֵדֶן',
    category: 'Мистические концепции',
    relatedConcepts: ['edinstvo', 'svet'],
  },

  'хохма': {
    definition: 'Мудрость',
    etymology: 'Евр. חָכְמָה',
    category: 'Мистические концепции',
    relatedConcepts: ['bina', 'daat'],
  },

  'бина': {
    definition: 'Понимание, различение',
    etymology: 'Евр. בִּינָה',
    category: 'Мистические концепции',
    relatedConcepts: ['hochma', 'daat'],
  },

  'даат': {
    definition: 'Знание, познание',
    etymology: 'Евр. דַּעַת',
    category: 'Мистические концепции',
    relatedConcepts: ['hochma', 'bina'],
  },

  'дух': {
    definition: 'Нематериальная субстанция, часть невидимой реальности',
    category: 'Мистические концепции',
    relatedConcepts: ['svet', 'zhizn'],
  },

  // ==================== ДИАЛЕКТИЧЕСКИЕ ПОНЯТИЯ ====================

  'правда': {
    definition: 'То, что соответствует реальности, что известно Всевышнему как факт',
    category: 'Диалектические понятия',
    relatedConcepts: ['mishpat', 'otkrytost'],
  },

  'царство': {
    definition: 'Малхут - следование за Голосом Всевышнего',
    etymology: 'Евр. מַלְכוּת (малхут)',
    category: 'Диалектические понятия',
    relatedConcepts: ['zamysel-vsevyshnego'],
  },

  'подобие': {
    definition: 'Соответствие качествам Создателя',
    category: 'Диалектические понятия',
    relatedConcepts: ['dmut', 'zamysel-vsevyshnego'],
  },

  'единство': {
    definition: 'Внутренняя близость',
    category: 'Диалектические понятия',
    relatedConcepts: ['semya', 'eden'],
  },

  'жизнь': {
    definition: 'Следование желаниям сердца. Вечная - желаниям Всевышнего',
    category: 'Диалектические понятия',
    relatedConcepts: ['smert', 'zamysel-vsevyshnego'],
  },

  'семья': {
    definition: 'Духовная общность',
    category: 'Диалектические понятия',
    relatedConcepts: ['edinstvo', 'semeynoe-delo'],
  },

  'тьма': {
    definition: 'Непонимание, ступор, тяжесть',
    category: 'Диалектические понятия',
    relatedConcepts: ['svet'],
  },

  'свет': {
    definition: 'Ясность, тепло, созидание',
    category: 'Диалектические понятия',
    relatedConcepts: ['tma', 'duh'],
  },

  'самость': {
    definition: 'Эгоистическое животное начало в человеке',
    category: 'Диалектические понятия',
    relatedConcepts: ['greh', 'nahash'],
  },

  // ==================== ПРОЦЕССЫ И СОСТОЯНИЯ ====================

  'грех': {
    definition: 'Промах относительно задуманного',
    category: 'Процессы и состояния',
    relatedConcepts: ['smert', 'nahash'],
  },

  'смерть': {
    definition: 'Жизнь в промахах',
    category: 'Процессы и состояния',
    relatedConcepts: ['greh', 'zhizn', 'tamut'],
  },

  'бедствие': {
    definition: 'Незнание или отход от Пути спасения',
    category: 'Процессы и состояния',
    relatedConcepts: ['spasenie'],
  },

  'спасение': {
    definition: 'Исправление в себе служения Нахашу, обретение сыновства Всевышнему',
    category: 'Процессы и состояния',
    relatedConcepts: ['yeshua', 'tshuvа', 'nahash'],
  },

  'хлеб': {
    definition: 'Духовное питание, строительный материал души',
    category: 'Процессы и состояния',
    relatedConcepts: ['rost'],
  },

  'рост': {
    definition: 'Приобретение качеств сына Всевышнего',
    category: 'Процессы и состояния',
    relatedConcepts: ['hleb', 'podbobiye'],
  },

  'воображение': {
    definition: 'Генерирование образов и идей, моделей и смыслов',
    category: 'Процессы и состояния',
    relatedConcepts: ['nahash', 'kartina'],
  },

  'картина': {
    definition: 'Набор фактов, дающих представление о реальности',
    category: 'Процессы и состояния',
    relatedConcepts: ['pravda', 'kartinka'],
  },

  'картинка': {
    definition: 'Картина реальности, разбавленная домыслами и иллюзиями',
    category: 'Процессы и состояния',
    relatedConcepts: ['kartina', 'voobrazhenie'],
  },

  'сердце': {
    definition: 'Эмоциональный центр, источник желаний и переживаний, зависящих от картины мира',
    category: 'Процессы и состояния',
    relatedConcepts: ['kartina', 'szhatie-serdca'],
  },

  'сжатие сердца': {
    definition: 'Душевная теснота, боль, вызванная внутренним сопротивлением',
    category: 'Процессы и состояния',
    relatedConcepts: ['serdce', 'vnutrennyaya-rabota'],
  },

  'горение': {
    definition: 'Состояние жизни в Замысле',
    category: 'Процессы и состояния',
    relatedConcepts: ['zhizn', 'zamysel-vsevyshnego'],
  },

  // ==================== НРАВСТВЕННЫЕ КАЧЕСТВА ====================

  'открытость': {
    definition: 'Несопротивление слышать правду о себе, и открывать её по запросу',
    category: 'Нравственные качества',
    relatedConcepts: ['pravda', 'lukavstvo'],
  },

  'лукавство': {
    definition: 'Незаинтересованность в правде о себе, обход её в мыслях и словах',
    category: 'Нравственные качества',
    relatedConcepts: ['otkrytost', 'pravda'],
  },

  'верность присяге': {
    definition: 'Постоянство в духовных обязательствах - Завете со Всевышним',
    category: 'Нравственные качества',
    relatedConcepts: ['zamysel-vsevyshnego'],
  },

  'мужество': {
    definition: 'Духовная смелость в следовании истине',
    category: 'Нравственные качества',
    relatedConcepts: ['pravda'],
  },

  // ==================== ВНУТРЕННЯЯ РАБОТА И ПРАКТИКИ ====================

  'сердечный уровень': {
    definition: 'Способность наблюдать умом за происходящими в сердце событиями',
    category: 'Внутренняя работа и практики',
    relatedConcepts: ['serdce', 'bodrovstvovanie'],
  },

  'умение слушать': {
    definition: 'Способность добывать Пшат из текста, не домысливая, и не отвлекаясь на шумы ума и сердца',
    category: 'Внутренняя работа и практики',
    relatedConcepts: ['pravda', 'otkrytost'],
  },

  'искусство общения': {
    definition: 'Способность аутентично понимать собеседника и помогать ему понимать себя',
    category: 'Внутренняя работа и практики',
    relatedConcepts: ['umenie-slushat', 'otkrytost'],
  },

  'внутренняя работа': {
    definition: 'Перемена мнения (метанойа) через исследование изъянов в своей картине мира, проявившихся в моменты сердечного сопротивления правде и боли от происходящего',
    category: 'Внутренняя работа и практики',
    relatedConcepts: ['kartina', 'szhatie-serdca', 'tshuvа'],
  },

  'бодрствование': {
    definition: 'Состояние внимательного наблюдения за состоянием сердца на предмет сопротивления',
    category: 'Внутренняя работа и практики',
    relatedConcepts: ['serdechnyy-uroven', 'molitvennoe-sostoyanie'],
  },

  'молитвенное состояние': {
    definition: 'Состояние внутреннего диалога со Всевышним',
    category: 'Внутренняя работа и практики',
    relatedConcepts: ['bodrovstvovanie'],
  },

  // ==================== СПЕЦИФИЧЕСКИЕ ТЕРМИНЫ ====================

  'КВС': {
    definition: 'Карта Внутренних Событий [хронологический слепок событий в человеке: ...картина реальности → картинка воображения → мысль → переживание → мысль ... ]. Необходима при ВР (внутренней работе) для понимания причинно-следственных связей',
    category: 'Специфические термины',
    relatedConcepts: ['vnutrennyaya-rabota', 'kartina', 'kartinka'],
  },

  'тамут': {
    definition: 'Патогенное состояние души, результат питания с Дерева "тов вэ-ра". По сути обещанное Всевышним состояние "смерти". Состояние, когда человек не может слышать и понимать истину - по сути питаться с деревьев Сада Эдена',
    etymology: 'Евр. תָּמוּת',
    category: 'Специфические термины',
    relatedConcepts: ['smert', 'eden', 'greh'],
  },

  'логос': {
    definition: 'Божественный замысел в действии, Слово',
    etymology: 'Греч. λόγος',
    category: 'Мистические концепции',
    relatedConcepts: ['zamysel-vsevyshnego', 'yeshua'],
  },

  'семейное дело': {
    definition: 'Преемственность передачи духовного знания из поколения в поколение',
    category: 'Диалектические понятия',
    relatedConcepts: ['semya', 'zamysel-vsevyshnego'],
  },
};

/**
 * Получить определение термина
 * @param {string} termName - Название термина
 * @returns {string} Определение термина или сообщение об ошибке
 */
export function getTermDefinition(termName) {
  const term = TERMS[termName];
  return term ? term.definition : 'Определение не найдено.';
}

/**
 * Получить полную информацию о термине
 * @param {string} termName - Название термина
 * @returns {Term|null} Объект термина или null
 */
export function getTerm(termName) {
  return TERMS[termName] || null;
}

/**
 * Получить все термины определенной категории
 * @param {string} category - Название категории
 * @returns {Array<{name: string, term: Term}>} Массив терминов
 */
export function getTermsByCategory(category) {
  return Object.entries(TERMS)
    .filter(([_, term]) => term.category === category)
    .map(([name, term]) => ({ name, term }));
}

/**
 * Получить список всех категорий
 * @returns {string[]} Уникальный список категорий
 */
export function getCategories() {
  return [...new Set(Object.values(TERMS).map(term => term.category))];
}