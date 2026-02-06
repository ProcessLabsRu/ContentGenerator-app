# 📦 Создание основных коллекций

Инструкция по созданию коллекций `generations` и `content_plan_items` для хранения генераций и контент-планов.

---

## 📦 Коллекция 1: generations

### Создание
1. Collections → **+ New collection**
2. Name: `generations`
3. Type: **Base collection**

### Поля

| Имя | Тип | Обязательное | Настройки |
|-----|-----|--------------|-----------|
| `userId` | Text | ❌ | - |
| `organizationId` | Text | ❌ | - |
| `specialization` | Text | ✅ | - |
| `purpose` | Text | ❌ | - |
| `contentType` | Text | ❌ | - |
| `numberOfPublications` | Number | ✅ | Min: 1 |
| `context` | Text | ❌ | - |
| `month` | Text | ❌ | - |
| `goals` | JSON | ❌ | - |
| `formatCounts` | JSON | ❌ | - |
| `useHealthCalendar` | Bool | ❌ | - |
| `status` | Select | ✅ | Values: `draft`, `generated`, `completed` |
| `generatedAt` | Date | ❌ | - |

### API Rules
- **List rule**: `@request.auth.id != ""`
- **View rule**: `@request.auth.id != ""`
- **Create rule**: `@request.auth.id != ""`
- **Update rule**: `@request.auth.id != "" && userId = @request.auth.id`
- **Delete rule**: `@request.auth.id != "" && userId = @request.auth.id`

---

## 📦 Коллекция 2: content_plan_items

⚠️ **Создавайте после `generations`!** (зависит от неё)

### Создание
1. Collections → **+ New collection**
2. Name: `content_plan_items`
3. Type: **Base collection**

### Поля

| Имя | Тип | Обязательное | Настройки |
|-----|-----|--------------|-----------|
| `generationId` | Relation | ✅ | Collection: `generations`, Max: 1, Cascade delete: ✅ |
| `title` | Text | ✅ | - |
| `format` | Text | ✅ | - |
| `status` | Select | ✅ | Values: `draft`, `selected`, `generated` |
| `publishDate` | Date | ❌ | - |
| `approved` | Bool | ❌ | - |
| `painPoint` | Text | ❌ | - |
| `cta` | Text | ❌ | - |
| `contentOutline` | Text | ❌ | - |
| `metadata` | JSON | ❌ | - |

### API Rules
- **List rule**: `@request.auth.id != ""`
- **View rule**: `@request.auth.id != ""`
- **Create rule**: `@request.auth.id != ""`
- **Update rule**: `@request.auth.id != ""`
- **Delete rule**: `@request.auth.id != ""`

---

## ✅ Проверка

После создания коллекций проверьте:

```bash
# Должны вернуться обе коллекции (требуется авторизация)
curl -s "https://pocketbase.processlabs.ru/api/collections" \
  -H "Authorization: YOUR_TOKEN" | jq -r '.[].name' | grep -E '(generations|content_plan_items)'
```

---

## 💡 Важные моменты

### Relation поле `generationId`
- **Collection**: выберите `generations` из списка
- **Max select**: 1 (одна генерация на элемент плана)
- **Cascade delete**: ✅ (при удалении генерации удаляются все её элементы)

### Select поля
Для поля `status` в `generations`:
- Нажмите **+ Add option**
- Добавьте: `draft`, `generated`, `completed`

Для поля `status` в `content_plan_items`:
- Добавьте: `draft`, `selected`, `generated`

### API Rules - безопасность
- Пользователи видят только свои генерации (`userId = @request.auth.id`)
- Могут редактировать/удалять только свои генерации
- Все операции требуют авторизации

---

## 🎯 После создания

Коллекции готовы к использованию! Приложение сможет:
- ✅ Создавать новые генерации
- ✅ Сохранять контент-планы
- ✅ Отслеживать статусы
- ✅ Связывать элементы планов с генерациями

---

## 📚 Связанные файлы

- [lib/pocketbase-types.ts](file:///Users/romangaleev/Documents/Antigravity/ContentGenerator-app/lib/pocketbase-types.ts) - TypeScript типы для коллекций
- [pocketbase_collections_simplified.json](file:///Users/romangaleev/Documents/Antigravity/ContentGenerator-app/pocketbase_collections_simplified.json) - Полная JSON-схема
