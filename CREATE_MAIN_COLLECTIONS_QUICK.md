# ⚡ Быстрое создание generations и content_plan_items

## 📦 Коллекция 1: generations (5 минут)

1. **Collections** → **+ New collection**
2. **Name**: `generations`, **Type**: Base collection
3. **Добавьте поля** (кнопка + New field):

```
userId                  [Text]      
organizationId          [Text]      
specialization          [Text]      Required ✅
purpose                 [Text]      
contentType             [Text]      
numberOfPublications    [Number]    Required ✅, Min: 1
context                 [Text]      
month                   [Text]      
goals                   [JSON]      
formatCounts            [JSON]      
useHealthCalendar       [Bool]      
status                  [Select]    Required ✅, Values: draft, generated, completed
generatedAt             [Date]      
```

4. **API Rules**:
   - List: `@request.auth.id != ""`
   - View: `@request.auth.id != ""`
   - Create: `@request.auth.id != ""`
   - Update: `@request.auth.id != "" && userId = @request.auth.id`
   - Delete: `@request.auth.id != "" && userId = @request.auth.id`

5. **Save**

---

## 📦 Коллекция 2: content_plan_items (3 минуты)

1. **Collections** → **+ New collection**
2. **Name**: `content_plan_items`, **Type**: Base collection
3. **Добавьте поля**:

```
generationId      [Relation]  Required ✅ → generations, Max: 1, Cascade delete: ✅
title             [Text]      Required ✅
format            [Text]      Required ✅
status            [Select]    Required ✅, Values: draft, selected, generated
publishDate       [Date]      
approved          [Bool]      
painPoint         [Text]      
cta               [Text]      
contentOutline    [Text]      
metadata          [JSON]      
```

4. **API Rules** (все одинаковые):
   - List/View/Create/Update/Delete: `@request.auth.id != ""`

5. **Save**

---

## ✅ Готово!

Проверьте что коллекции созданы в Admin UI.

**Важно для Relation поля:**
- В поле `generationId` выберите коллекцию `generations` из выпадающего списка
- Установите **Max select**: 1
- Включите **Cascade delete** (чекбокс)

---

## 🎯 После создания

Приложение готово к работе! Можно:
- Создавать генерации контента
- Сохранять контент-планы
- Отслеживать статусы
