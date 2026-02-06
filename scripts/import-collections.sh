#!/bin/bash

# Скрипт для импорта коллекций в PocketBase через Admin UI
# Использование: ./scripts/import-collections.sh

set -e

# Загружаем переменные окружения
if [ -f .env.pocketbase ]; then
    source .env.pocketbase
else
    echo "❌ Файл .env.pocketbase не найден"
    exit 1
fi

echo "🚀 Импорт коллекций в PocketBase..."
echo ""
echo "📡 URL: $POCKETBASE_URL"
echo "👤 Admin: $POCKETBASE_ADMIN_EMAIL"
echo ""

# Проверка подключения
echo "🔍 Проверка подключения к PocketBase..."
if ! curl -s -f "${POCKETBASE_URL}api/health" > /dev/null; then
    echo "❌ PocketBase недоступен по адресу: $POCKETBASE_URL"
    exit 1
fi
echo "✅ PocketBase доступен"
echo ""

# Аутентификация
echo "🔐 Аутентификация..."
AUTH_RESPONSE=$(curl -s -X POST "${POCKETBASE_URL}api/admins/auth-with-password" \
    -H "Content-Type: application/json" \
    -d "{\"identity\":\"$POCKETBASE_ADMIN_EMAIL\",\"password\":\"$POCKETBASE_ADMIN_PASSWORD\"}")

TOKEN=$(echo $AUTH_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo "❌ Ошибка аутентификации"
    echo "Ответ сервера: $AUTH_RESPONSE"
    exit 1
fi
echo "✅ Успешная аутентификация"
echo ""

echo "📚 Для импорта коллекций используйте Admin UI:"
echo ""
echo "1. Откройте: ${POCKETBASE_URL}_/"
echo "2. Войдите с учетными данными администратора"
echo "3. Перейдите в Settings → Import collections"
echo "4. Загрузите файл: pocketbase_collections_with_dictionaries.json"
echo "5. Нажмите Import"
echo ""
echo "После импорта запустите скрипт заполнения данными:"
echo "  ./scripts/seed-dictionaries.sh"
echo ""
