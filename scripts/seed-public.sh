#!/bin/bash

# Скрипт для заполнения справочников БЕЗ аутентификации
# Используется когда API Rules временно открыты для публичного доступа

set -e

API_URL="https://pocketbase.processlabs.ru/"

echo "🌱 Заполнение справочников PocketBase (без аутентификации)..."
echo ""
echo "📡 URL: $API_URL"
echo ""

# Функция для создания записи
create_record() {
    local collection=$1
    local data=$2
    local name=$3
    
    RESPONSE=$(curl -s -X POST "${API_URL}api/collections/${collection}/records" \
        -H "Content-Type: application/json" \
        -d "$data")
    
    if echo "$RESPONSE" | grep -q '"id"'; then
        echo "   ✅ Создано: $name"
        return 0
    else
        echo "   ⚠️  Ошибка: $name"
        echo "      $RESPONSE" | head -c 150
        echo ""
        return 1
    fi
}

# Заполнение medical_specializations
echo "📦 Заполнение коллекции: medical_specializations..."
create_record "medical_specializations" '{"name":"Mamografia/Mastologia","nameEn":"Mammography/Mastology","slug":"mamografia-mastologia","icon":"🩺","isActive":true,"sortOrder":1}' "Mamografia/Mastologia"
create_record "medical_specializations" '{"name":"Ginecologia e Obstetrícia","nameEn":"Gynecology and Obstetrics","slug":"ginecologia-obstetricia","icon":"👶","isActive":true,"sortOrder":3}' "Ginecologia e Obstetrícia"
create_record "medical_specializations" '{"name":"Dermatologia","nameEn":"Dermatology","slug":"dermatologia","icon":"🧴","isActive":true,"sortOrder":4}' "Dermatologia"
create_record "medical_specializations" '{"name":"Pediatria","nameEn":"Pediatrics","slug":"pediatria","icon":"👨‍⚕️","isActive":true,"sortOrder":5}' "Pediatria"
create_record "medical_specializations" '{"name":"Cardiologia","nameEn":"Cardiology","slug":"cardiologia","icon":"❤️","isActive":true,"sortOrder":6}' "Cardiologia"
create_record "medical_specializations" '{"name":"Ortopedia","nameEn":"Orthopedics","slug":"ortopedia","icon":"🦴","isActive":true,"sortOrder":7}' "Ortopedia"
create_record "medical_specializations" '{"name":"Oftalmologia","nameEn":"Ophthalmology","slug":"oftalmologia","icon":"👁️","isActive":true,"sortOrder":8}' "Oftalmologia"
create_record "medical_specializations" '{"name":"Endocrinologia","nameEn":"Endocrinology","slug":"endocrinologia","icon":"🧬","isActive":true,"sortOrder":9}' "Endocrinologia"
create_record "medical_specializations" '{"name":"Nutrologia/Nutrição","nameEn":"Nutrology/Nutrition","slug":"nutrologia-nutricao","icon":"🥗","isActive":true,"sortOrder":10}' "Nutrologia/Nutrição"
echo ""

# Заполнение content_goals
echo "📦 Заполнение коллекции: content_goals..."
create_record "content_goals" '{"name":"Conversão","nameEn":"Conversion","slug":"conversao","description":"Foco em gerar leads e conversões","defaultWeight":1.5,"isActive":true,"sortOrder":1}' "Conversão"
create_record "content_goals" '{"name":"Autoridade","nameEn":"Authority","slug":"autoridade","description":"Estabelecer expertise e credibilidade","defaultWeight":1.2,"isActive":true,"sortOrder":2}' "Autoridade"
create_record "content_goals" '{"name":"Crescimento","nameEn":"Growth","slug":"crescimento","description":"Aumentar alcance e seguidores","defaultWeight":1.3,"isActive":true,"sortOrder":3}' "Crescimento"
create_record "content_goals" '{"name":"Educação","nameEn":"Education","slug":"educacao","description":"Educar e informar o público","defaultWeight":1.0,"isActive":true,"sortOrder":4}' "Educação"
create_record "content_goals" '{"name":"Engajamento","nameEn":"Engagement","slug":"engajamento","description":"Aumentar interação e participação","defaultWeight":1.1,"isActive":true,"sortOrder":5}' "Engajamento"
echo ""

# Заполнение instagram_formats
echo "📦 Заполнение коллекции: instagram_formats..."
create_record "instagram_formats" '{"name":"Reels","nameEn":"Reels","slug":"reels","icon":"🎬","description":"Vídeo dinâmico para alcance","defaultCount":6,"isActive":true,"sortOrder":1}' "Reels"
create_record "instagram_formats" '{"name":"Carrossel","nameEn":"Carousel","slug":"carrossel","icon":"📸","description":"Slides educacionais","defaultCount":10,"isActive":true,"sortOrder":2}' "Carrossel"
create_record "instagram_formats" '{"name":"Post Estático","nameEn":"Static Post","slug":"postEstatico","icon":"🖼️","description":"Imagem fixa para branding","defaultCount":5,"isActive":true,"sortOrder":3}' "Post Estático"
create_record "instagram_formats" '{"name":"Stories","nameEn":"Stories","slug":"stories","icon":"📱","description":"Atualizações sequenciais","defaultCount":15,"isActive":true,"sortOrder":4}' "Stories"
create_record "instagram_formats" '{"name":"Live/Collab","nameEn":"Live/Collab","slug":"liveCollab","icon":"🎥","description":"Networking em tempo real","defaultCount":2,"isActive":true,"sortOrder":5}' "Live/Collab"
echo ""

# Заполнение months
echo "📦 Заполнение коллекции: months..."
create_record "months" '{"name":"Janeiro","nameEn":"January","number":1,"slug":"janeiro","isActive":true}' "Janeiro"
create_record "months" '{"name":"Fevereiro","nameEn":"February","number":2,"slug":"fevereiro","isActive":true}' "Fevereiro"
create_record "months" '{"name":"Março","nameEn":"March","number":3,"slug":"marco","isActive":true}' "Março"
create_record "months" '{"name":"Abril","nameEn":"April","number":4,"slug":"abril","isActive":true}' "Abril"
create_record "months" '{"name":"Maio","nameEn":"May","number":5,"slug":"maio","isActive":true}' "Maio"
create_record "months" '{"name":"Junho","nameEn":"June","number":6,"slug":"junho","isActive":true}' "Junho"
create_record "months" '{"name":"Julho","nameEn":"July","number":7,"slug":"julho","isActive":true}' "Julho"
create_record "months" '{"name":"Agosto","nameEn":"August","number":8,"slug":"agosto","isActive":true}' "Agosto"
create_record "months" '{"name":"Setembro","nameEn":"September","number":9,"slug":"setembro","isActive":true}' "Setembro"
create_record "months" '{"name":"Outubro","nameEn":"October","number":10,"slug":"outubro","isActive":true}' "Outubro"
create_record "months" '{"name":"Novembro","nameEn":"November","number":11,"slug":"novembro","isActive":true}' "Novembro"
create_record "months" '{"name":"Dezembro","nameEn":"December","number":12,"slug":"dezembro","isActive":true}' "Dezembro"
echo ""

echo "🎉 Заполнение завершено!"
echo ""
echo "📊 Не забудьте вернуть API Rules обратно:"
echo "   Create/Update/Delete: @request.auth.id != \"\""
echo ""
