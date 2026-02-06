# 🔐 Настройка авторизации

## 1. Создание пользователей в PocketBase

### Шаг 1: Откройте Admin UI
Перейдите: https://pocketbase.processlabs.ru/_/

### Шаг 2: Откройте коллекцию Users
Collections → **users** (должна быть создана по умолчанию)

### Шаг 3: Добавьте поле для роли

1. Откройте настройки коллекции `users`
2. Добавьте новое поле:
   - **Name**: `role`
   - **Type**: Select
   - **Options**: `admin`, `member`
   - **Required**: ✅
   - **Default**: `member`
3. Save

### Шаг 4: Создайте пользователя Admin

1. **+ New record**
2. Заполните:
   ```
   email:    r.i.galeev@gmail.com
   password: G@leevR0m@n
   role:     admin
   verified: ✅ (отметьте галочку)
   ```
3. Save

### Шаг 5: Создайте тестового пользователя Member

1. **+ New record**
2. Заполните:
   ```
   email:    test@example.com
   password: Test123!
   role:     member
   verified: ✅
   ```
3. Save

## 2. Обновите API Rules

Для коллекций `generations` и `content_plan_items` обновите правила:

### generations
- **List rule**: `@request.auth.id != ""`
- **View rule**: `@request.auth.id != ""`
- **Create rule**: `@request.auth.id != ""`
- **Update rule**: `userId = @request.auth.id || @request.auth.role = "admin"`
- **Delete rule**: `userId = @request.auth.id || @request.auth.role = "admin"`

### content_plan_items
- **List rule**: `@request.auth.id != ""`
- **View rule**: `@request.auth.id != ""`
- **Create rule**: `@request.auth.id != ""`
- **Update rule**: `@request.auth.id != "" || @request.auth.role = "admin"`
- **Delete rule**: `@request.auth.id != "" || @request.auth.role = "admin"`

## 3. Готово!

После создания пользователей и обновления правил, приложение готово к использованию с авторизацией.

**Учетные данные:**
- **Admin**: r.i.galeev@gmail.com / G@leevR0m@n
- **Test Member**: test@example.com / Test123!
