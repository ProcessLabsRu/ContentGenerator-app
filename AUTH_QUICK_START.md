# 🔐 Авторизация - Быстрый старт

## Шаг 1: Добавьте поле role в коллекцию users

1. Откройте PocketBase Admin UI: https://pocketbase.processlabs.ru/_/
2. Перейдите в Collections → **users**
3. Нажмите на иконку настроек (⚙️) коллекции
4. Добавьте новое поле:
   - **Name**: `role`
   - **Type**: Select
   - **Options**: `admin`, `member`
   - **Required**: ✅
   - **Default value**: `member`
5. **Save changes**

## Шаг 2: Создайте пользователей

### Вариант А: Через Admin UI (рекомендуется)

1. В коллекции **users** нажмите **+ New record**
2. Создайте администратора:
   ```
   email:    r.i.galeev@gmail.com
   password: G@leevR0m@n
   role:     admin
   verified: ✅
   ```
3. Создайте тестового пользователя:
   ```
   email:    test@example.com
   password: Test123!
   role:     member
   verified: ✅
   ```

### Вариант Б: Через скрипт

```bash
./scripts/create-users.sh
```

**Примечание:** Скрипт может не сработать из-за API Rules. Используйте Admin UI.

## Шаг 3: Обновите API Rules (опционально)

Для коллекций `generations` и `content_plan_items`:

### generations
- **List**: `@request.auth.id != ""`
- **View**: `@request.auth.id != ""`
- **Create**: `@request.auth.id != ""`
- **Update**: `userId = @request.auth.id || @request.auth.role = "admin"`
- **Delete**: `userId = @request.auth.id || @request.auth.role = "admin"`

### content_plan_items
- **List**: `@request.auth.id != ""`
- **View**: `@request.auth.id != ""`
- **Create**: `@request.auth.id != ""`
- **Update**: `@request.auth.id != "" || @request.auth.role = "admin"`
- **Delete**: `@request.auth.id != "" || @request.auth.role = "admin"`

## Готово! 🎉

Теперь при открытии приложения вы увидите форму входа.

**Учетные данные:**
- **Admin**: r.i.galeev@gmail.com / G@leevR0m@n
- **Test Member**: test@example.com / Test123!

## Что добавлено

- ✅ Форма входа в систему
- ✅ Меню пользователя в навигации
- ✅ Защита всех страниц (требуется авторизация)
- ✅ Роли: admin и member
- ✅ Автоматический выход при истечении сессии
- ✅ Сохранение сессии в localStorage
