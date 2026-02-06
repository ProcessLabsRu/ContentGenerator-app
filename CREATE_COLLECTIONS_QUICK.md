# 🎯 Быстрое создание коллекций (5 минут)

Импорт JSON не работает? Создайте коллекции вручную - это быстро и надежно!

## 📦 Коллекция 1: medical_specializations

1. Collections → **+ New collection**
2. Name: `medical_specializations`
3. Добавьте поля (кнопка **+ New field**):

```
name          [Text]    Required ✅
nameEn        [Text]    
slug          [Text]    Required ✅
icon          [Text]    
description   [Text]    
isActive      [Bool]    
sortOrder     [Number]  
```

4. **API rules** → Оставьте List и View пустыми, остальные: `@request.auth.id != ""`
5. **Save**

---

## 📦 Коллекция 2: content_goals

1. Collections → **+ New collection**
2. Name: `content_goals`
3. Поля:

```
name            [Text]    Required ✅
nameEn          [Text]    
slug            [Text]    Required ✅
description     [Text]    
defaultWeight   [Number]  
isActive        [Bool]    
sortOrder       [Number]  
```

4. **API rules** → List и View пустые, остальные: `@request.auth.id != ""`
5. **Save**

---

## 📦 Коллекция 3: instagram_formats

1. Collections → **+ New collection**
2. Name: `instagram_formats`
3. Поля:

```
name           [Text]    Required ✅
nameEn         [Text]    
slug           [Text]    Required ✅
icon           [Text]    
description    [Text]    
defaultCount   [Number]  
isActive       [Bool]    
sortOrder      [Number]  
```

4. **API rules** → List и View пустые, остальные: `@request.auth.id != ""`
5. **Save**

---

## 📦 Коллекция 4: months

1. Collections → **+ New collection**
2. Name: `months`
3. Поля:

```
name       [Text]    Required ✅
nameEn     [Text]    
number     [Number]  Required ✅  (Min: 1, Max: 12)
slug       [Text]    Required ✅
isActive   [Bool]    
```

4. **API rules** → List и View пустые, остальные: `@request.auth.id != ""`
5. **Save**

---

## 📦 Коллекция 5: health_calendar_events

⚠️ **Создавайте последней!** (зависит от months и medical_specializations)

1. Collections → **+ New collection**
2. Name: `health_calendar_events`
3. Поля:

```
monthId           [Relation]  Required ✅  → months (Max: 1)
specializationId  [Relation]               → medical_specializations (Max: 1)
eventName         [Text]      Required ✅
eventNameEn       [Text]      
description       [Text]      Required ✅
descriptionEn     [Text]      
color             [Text]      
date              [Text]      
year              [Number]    
isActive          [Bool]      
```

4. **API rules** → List и View пустые, остальные: `@request.auth.id != ""`
5. **Save**

---

## ✅ Проверка

Запустите в терминале:

```bash
curl -s https://pocketbase.processlabs.ru/api/collections | jq -r '.[].name' | grep -E '(medical_specializations|content_goals|instagram_formats|months|health_calendar_events)'
```

Должны увидеть все 5 коллекций.

---

## 🌱 Заполнение данными

После создания коллекций запустите:

```bash
./scripts/seed-dictionaries.sh
```

Скрипт автоматически заполнит:
- 10 медицинских специализаций
- 5 целей контента
- 5 форматов Instagram
- 12 месяцев

---

## 💡 Советы

- **Порядок важен**: создавайте в указанной последовательности
- **Названия полей**: должны точно совпадать (регистр важен!)
- **Relation поля**: выбирайте правильную коллекцию из выпадающего списка
- **API rules**: можно скопировать-вставить: `@request.auth.id != ""`

---

## 🎉 Готово!

После создания коллекций и заполнения данными, справочники будут доступны в приложении!
