#!/bin/bash

# Скрипт для создания пользователей в PocketBase

POCKETBASE_URL="https://pocketbase.processlabs.ru"

# Цвета для вывода
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔐 Создание пользователей в PocketBase${NC}"
echo ""

# Функция для создания пользователя
create_user() {
    local email=$1
    local password=$2
    local role=$3
    
    echo -e "${YELLOW}Создание пользователя: ${email} (${role})${NC}"
    
    response=$(curl -s -X POST "${POCKETBASE_URL}/api/collections/users/records" \
        -H "Content-Type: application/json" \
        -d "{
            \"email\": \"${email}\",
            \"password\": \"${password}\",
            \"passwordConfirm\": \"${password}\",
            \"role\": \"${role}\",
            \"emailVisibility\": true,
            \"verified\": true
        }")
    
    if echo "$response" | grep -q '"id"'; then
        echo -e "${GREEN}✓ Пользователь создан успешно${NC}"
        echo ""
        return 0
    else
        echo -e "${RED}✗ Ошибка создания пользователя${NC}"
        echo "Response: $response"
        echo ""
        return 1
    fi
}

# Создание администратора
echo -e "${YELLOW}=== Создание администратора ===${NC}"
create_user "r.i.galeev@gmail.com" "G@leevR0m@n" "admin"

# Создание тестового пользователя
echo -e "${YELLOW}=== Создание тестового пользователя ===${NC}"
create_user "test@example.com" "Test123!" "member"

echo -e "${GREEN}✓ Готово!${NC}"
echo ""
echo "Учетные данные:"
echo "  Admin:  r.i.galeev@gmail.com / G@leevR0m@n"
echo "  Member: test@example.com / Test123!"
