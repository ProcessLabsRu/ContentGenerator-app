#!/bin/bash

# Скрипт для создания тестовых генераций и контент-планов
set -e

API_URL="https://pocketbase.processlabs.ru/"

echo "🧪 Создание тестовых данных..."
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
        ID=$(echo "$RESPONSE" | grep -o '"id":"[^"]*' | cut -d'"' -f4)
        echo "   ✅ Создано: $name (ID: $ID)"
        echo "$ID"
        return 0
    else
        echo "   ❌ Ошибка: $name"
        echo "      $RESPONSE" | head -c 200
        echo ""
        return 1
    fi
}

# Создание генерации 1: Кардиология
echo "📦 Создание генерации 1: Кардиология..."
GEN1_DATA='{
  "userId": "test_user_1",
  "specialization": "Cardiologia",
  "numberOfPublications": 30,
  "purpose": "Conversão",
  "contentType": "Instagram",
  "month": "Março",
  "context": "Clínica de cardiologia focada em prevenção de doenças cardiovasculares",
  "goals": ["Conversão", "Autoridade", "Educação"],
  "formatCounts": {
    "Reels": 8,
    "Carrossel": 12,
    "Post Estático": 6,
    "Stories": 4
  },
  "useHealthCalendar": true,
  "status": "generated",
  "generatedAt": "2026-02-06T00:00:00.000Z"
}'

GEN1_ID=$(create_record "generations" "$GEN1_DATA" "Geração Cardiologia")
echo ""

# Создание элементов контент-плана для генерации 1
if [ ! -z "$GEN1_ID" ]; then
    echo "📝 Создание контент-плана для генерации 1..."
    
    create_record "content_plan_items" "{
      \"generationId\": \"$GEN1_ID\",
      \"title\": \"5 Sinais de Alerta do Coração\",
      \"format\": \"Carrossel\",
      \"status\": \"selected\",
      \"publishDate\": \"2026-03-05\",
      \"approved\": true,
      \"painPoint\": \"Medo de infarto\",
      \"cta\": \"Agende sua consulta preventiva\",
      \"contentOutline\": \"Slide 1: Dor no peito\\nSlide 2: Falta de ar\\nSlide 3: Palpitações\\nSlide 4: Fadiga extrema\\nSlide 5: Inchaço nas pernas\"
    }" "Item 1: Sinais de Alerta"
    
    create_record "content_plan_items" "{
      \"generationId\": \"$GEN1_ID\",
      \"title\": \"Como Medir Sua Pressão em Casa\",
      \"format\": \"Reels\",
      \"status\": \"selected\",
      \"publishDate\": \"2026-03-08\",
      \"approved\": true,
      \"painPoint\": \"Dúvidas sobre medição correta\",
      \"cta\": \"Baixe nosso guia gratuito\",
      \"contentOutline\": \"Passo a passo visual de como medir pressão arterial corretamente\"
    }" "Item 2: Medir Pressão"
    
    create_record "content_plan_items" "{
      \"generationId\": \"$GEN1_ID\",
      \"title\": \"Alimentos que Protegem o Coração\",
      \"format\": \"Carrossel\",
      \"status\": \"draft\",
      \"publishDate\": \"2026-03-12\",
      \"approved\": false,
      \"painPoint\": \"Alimentação inadequada\",
      \"cta\": \"Consulte nosso nutricionista\",
      \"contentOutline\": \"Peixes, nozes, azeite, frutas vermelhas, vegetais verdes\"
    }" "Item 3: Alimentos Saudáveis"
    
    echo ""
fi

# Создание генерации 2: Dermatologia
echo "📦 Создание генерации 2: Dermatologia..."
GEN2_DATA='{
  "userId": "test_user_1",
  "specialization": "Dermatologia",
  "numberOfPublications": 20,
  "purpose": "Educação",
  "contentType": "Instagram",
  "month": "Março",
  "context": "Clínica dermatológica especializada em tratamentos estéticos e cuidados com a pele",
  "goals": ["Educação", "Crescimento", "Engajamento"],
  "formatCounts": {
    "Reels": 6,
    "Carrossel": 8,
    "Post Estático": 4,
    "Stories": 2
  },
  "useHealthCalendar": false,
  "status": "generated",
  "generatedAt": "2026-02-06T00:10:00.000Z"
}'

GEN2_ID=$(create_record "generations" "$GEN2_DATA" "Geração Dermatologia")
echo ""

# Создание элементов контент-плана для генерации 2
if [ ! -z "$GEN2_ID" ]; then
    echo "📝 Создание контент-плана для генерации 2..."
    
    create_record "content_plan_items" "{
      \"generationId\": \"$GEN2_ID\",
      \"title\": \"Rotina de Skincare Matinal\",
      \"format\": \"Reels\",
      \"status\": \"selected\",
      \"publishDate\": \"2026-03-03\",
      \"approved\": true,
      \"painPoint\": \"Não saber por onde começar\",
      \"cta\": \"Agende sua avaliação\",
      \"contentOutline\": \"Limpeza → Tônico → Sérum → Hidratante → Protetor solar\"
    }" "Item 1: Rotina Matinal"
    
    create_record "content_plan_items" "{
      \"generationId\": \"$GEN2_ID\",
      \"title\": \"Mitos e Verdades sobre Acne\",
      \"format\": \"Carrossel\",
      \"status\": \"selected\",
      \"publishDate\": \"2026-03-07\",
      \"approved\": true,
      \"painPoint\": \"Informações conflitantes\",
      \"cta\": \"Saiba mais no link da bio\",
      \"contentOutline\": \"Mito 1: Chocolate causa acne\\nVerdade 1: Estresse piora\\nMito 2: Sol melhora\\nVerdade 2: Hidratação é essencial\"
    }" "Item 2: Mitos e Verdades"
    
    echo ""
fi

echo "🎉 Testes dados criados com sucesso!"
echo ""
echo "📊 Resumo:"
echo "   - 2 gerações criadas"
echo "   - 5 itens de conteúdo criados"
echo ""
echo "🔒 Não esqueça de restaurar API Rules:"
echo "   Create/Update/Delete: @request.auth.id != \"\""
echo ""
