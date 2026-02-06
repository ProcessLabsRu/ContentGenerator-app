# 📝 Пошаговая инструкция по созданию коллекций вручную

Если импорт JSON не работает, создайте коллекции вручную через Admin UI.

## 🚀 Подготовка

1. Откройте Admin UI: https://pocketbase.processlabs.ru/_/
2. Войдите с учетными данными администратора

---

## 📦 Коллекция 1: `medical_specializations`

### Создание
1. **Collections** → **New collection**
2. **Name**: `medical_specializations`
3. **Type**: Base collection

### Поля
| Имя | Тип | Обязательное | Настройки |
|-----|-----|--------------|-----------|
| `name` | Text | ✅ | - |
| `nameEn` | Text | ❌ | - |
| `slug` | Text | ✅ | - |
| `icon` | Text | ❌ | - |
| `description` | Text | ❌ | - |
| `isActive` | Bool | ❌ | - |
| `sortOrder` | Number | ❌ | - |

### API Rules
- **List**: пусто (публичный доступ)
- **View**: пусто (публичный доступ)
- **Create**: `@request.auth.id != ""`
- **Update**: `@request.auth.id != ""`
- **Delete**: `@request.auth.id != ""`

---

## 📦 Коллекция 2: `content_goals`

### Создание
1. **Collections** → **New collection**
2. **Name**: `content_goals`
3. **Type**: Base collection

### Поля
| Имя | Тип | Обязательное | Настройки |
|-----|-----|--------------|-----------|
| `name` | Text | ✅ | - |
| `nameEn` | Text | ❌ | - |
| `slug` | Text | ✅ | - |
| `description` | Text | ❌ | - |
| `defaultWeight` | Number | ❌ | - |
| `isActive` | Bool | ❌ | - |
| `sortOrder` | Number | ❌ | - |

### API Rules
- **List**: пусто (публичный доступ)
- **View**: пусто (публичный доступ)
- **Create**: `@request.auth.id != ""`
- **Update**: `@request.auth.id != ""`
- **Delete**: `@request.auth.id != ""`

---

## 📦 Коллекция 3: `instagram_formats`

### Создание
1. **Collections** → **New collection**
2. **Name**: `instagram_formats`
3. **Type**: Base collection

### Поля
| Имя | Тип | Обязательное | Настройки |
|-----|-----|--------------|-----------|
| `name` | Text | ✅ | - |
| `nameEn` | Text | ❌ | - |
| `slug` | Text | ✅ | - |
| `icon` | Text | ❌ | - |
| `description` | Text | ❌ | - |
| `defaultCount` | Number | ❌ | - |
| `isActive` | Bool | ❌ | - |
| `sortOrder` | Number | ❌ | - |

### API Rules
- **List**: пусто (публичный доступ)
- **View**: пусто (публичный доступ)
- **Create**: `@request.auth.id != ""`
- **Update**: `@request.auth.id != ""`
- **Delete**: `@request.auth.id != ""`

---

## 📦 Коллекция 4: `months`

### Создание
1. **Collections** → **New collection**
2. **Name**: `months`
3. **Type**: Base collection

### Поля
| Имя | Тип | Обязательное | Настройки |
|-----|-----|--------------|-----------|
| `name` | Text | ✅ | - |
| `nameEn` | Text | ❌ | - |
| `number` | Number | ✅ | Min: 1, Max: 12 |
| `slug` | Text | ✅ | - |
| `isActive` | Bool | ❌ | - |

### API Rules
- **List**: пусто (публичный доступ)
- **View**: пусто (публичный доступ)
- **Create**: `@request.auth.id != ""`
- **Update**: `@request.auth.id != ""`
- **Delete**: `@request.auth.id != ""`

---

## 📦 Коллекция 5: `health_calendar_events`

### Создание
1. **Collections** → **New collection**
2. **Name**: `health_calendar_events`
3. **Type**: Base collection

### Поля
| Имя | Тип | Обязательное | Настройки |
|-----|-----|--------------|-----------|
| `monthId` | Relation | ✅ | Collection: `months`, Max select: 1 |
| `specializationId` | Relation | ❌ | Collection: `medical_specializations`, Max select: 1 |
| `eventName` | Text | ✅ | - |
| `eventNameEn` | Text | ❌ | - |
| `description` | Text | ✅ | - |
| `descriptionEn` | Text | ❌ | - |
| `color` | Text | ❌ | - |
| `date` | Text | ❌ | - |
| `year` | Number | ❌ | - |
| `isActive` | Bool | ❌ | - |

### API Rules
- **List**: пусто (публичный доступ)
- **View**: пусто (публичный доступ)
- **Create**: `@request.auth.id != ""`
- **Update**: `@request.auth.id != ""`
- **Delete**: `@request.auth.id != ""`

---

## ✅ После создания коллекций

Запустите скрипт заполнения данными:

```bash
./scripts/seed-dictionaries.sh
```

Или заполните данные вручную через Admin UI, используя примеры из `DICTIONARIES_GUIDE.md`.

---

## 💡 Советы

- Создавайте коллекции в указанном порядке (из-за связей между ними)
- `health_calendar_events` должна быть создана последней (зависит от `months` и `medical_specializations`)
- Проверяйте правильность названий полей - они должны точно совпадать
- После создания всех коллекций проверьте их через: `curl https://pocketbase.processlabs.ru/api/collections`
