# 🗄️ Настройка PocketBase для Content Generator

## Что такое PocketBase?

PocketBase - это open-source backend в одном файле, который включает:
- 🗃️ Встроенную базу данных (SQLite)
- 🔐 Аутентификацию пользователей
- 📡 Real-time subscriptions
- 🖼️ Хранилище файлов
- 📊 Admin UI для управления данными

## Установка и запуск PocketBase

### 1. Скачать PocketBase

**macOS/Linux:**
```bash
# Скачать последнюю версию
wget https://github.com/pocketbase/pocketbase/releases/download/v0.22.0/pocketbase_0.22.0_darwin_amd64.zip

# Распаковать
unzip pocketbase_0.22.0_darwin_amd64.zip

# Сделать исполняемым
chmod +x pocketbase
```

**Windows:**
Скачайте `.zip` файл с [GitHub Releases](https://github.com/pocketbase/pocketbase/releases) и распакуйте.

### 2. Запустить PocketBase

```bash
# Запуск на порту 8090 (по умолчанию)
./pocketbase serve

# Или на другом порту
./pocketbase serve --http=0.0.0.0:8091
```

PocketBase будет доступен по адресу:
- **API**: http://localhost:8090
- **Admin UI**: http://localhost:8090/_/

### 3. Создать Admin аккаунт

При первом запуске откройте http://localhost:8090/_/ и создайте admin аккаунт.

## Настройка коллекций

### Коллекция: `generations`

Создайте коллекцию для хранения генераций контент-планов:

**Поля:**
- `userId` (Text, optional) - ID пользователя
- `organizationId` (Text, optional) - ID организации
- `specialization` (Text, required) - Медицинская специализация
- `purpose` (Text, optional) - Цель публикации
- `contentType` (Text, optional) - Тип контента
- `numberOfPublications` (Number, required) - Количество публикаций
- `context` (Text, optional) - Дополнительный контекст
- `month` (Text, optional) - Месяц планирования
- `goals` (JSON, optional) - Массив целей
- `formatCounts` (JSON, optional) - Объект с количеством форматов
- `useHealthCalendar` (Bool, default: false) - Использовать календарь здоровья
- `status` (Select, required) - Статус: draft, generated, completed
- `generatedAt` (Date, optional) - Дата генерации

**API Rules:**
- List/View: `@request.auth.id != ""`
- Create: `@request.auth.id != ""`
- Update: `@request.auth.id != "" && userId = @request.auth.id`
- Delete: `@request.auth.id != "" && userId = @request.auth.id`

### Коллекция: `content_plan_items`

Создайте коллекцию для хранения элементов контент-плана:

**Поля:**
- `generationId` (Relation to generations, required) - Связь с генерацией
- `title` (Text, required) - Заголовок поста
- `format` (Text, required) - Формат (reels, carousel, etc.)
- `status` (Select, required) - Статус: draft, selected, generated
- `publishDate` (Date, optional) - Дата публикации
- `approved` (Bool, default: false) - Одобрено
- `painPoint` (Text, optional) - Болевая точка
- `cta` (Text, optional) - Call to action
- `contentOutline` (Text, optional) - Структура контента
- `metadata` (JSON, optional) - Дополнительные данные

**API Rules:**
- List/View: `@request.auth.id != ""`
- Create: `@request.auth.id != ""`
- Update: `@request.auth.id != ""`
- Delete: `@request.auth.id != ""`

## Настройка переменных окружения

### Локальная разработка (`.env.local`)

```env
DATABASE_PROVIDER=pocketbase
POCKETBASE_URL=http://localhost:8090
```

### Production (`.env.production`)

```env
DATABASE_PROVIDER=pocketbase
POCKETBASE_URL=https://your-pocketbase-domain.com
```

Для публичного доступа с клиента также добавьте:
```env
NEXT_PUBLIC_POCKETBASE_URL=https://your-pocketbase-domain.com
```

## Использование в коде

### Server-side (API Routes, Server Components)

```typescript
import { getPocketBase } from '@/lib/pocketbase';
import { createGeneration, getGenerations } from '@/lib/pocketbase-service';

// В API route
export async function POST(request: Request) {
  const formData = await request.json();
  
  const generation = await createGeneration(formData);
  
  return Response.json(generation);
}
```

### Client-side (Client Components)

```typescript
'use client';

import { initPocketBase } from '@/lib/pocketbase';
import { useEffect, useState } from 'react';

export function MyComponent() {
  const [pb] = useState(() => initPocketBase());
  
  useEffect(() => {
    // Подписка на изменения
    pb.collection('generations').subscribe('*', (e) => {
      console.log('Generation updated:', e.record);
    });
    
    return () => {
      pb.collection('generations').unsubscribe();
    };
  }, [pb]);
}
```

## Проверка подключения

Создайте API route для проверки:

```typescript
// app/api/health/pocketbase/route.ts
import { checkPocketBaseConnection } from '@/lib/pocketbase-service';

export async function GET() {
  const isConnected = await checkPocketBaseConnection();
  
  return Response.json({
    status: isConnected ? 'ok' : 'error',
    provider: 'pocketbase',
  });
}
```

## Миграция данных

Если у вас уже есть данные в PostgreSQL, вы можете создать скрипт миграции:

```typescript
// scripts/migrate-to-pocketbase.ts
import { getPocketBase } from '../lib/pocketbase';
// ... импорт данных из PostgreSQL

async function migrate() {
  const pb = getPocketBase();
  
  // Миграция генераций
  for (const gen of oldGenerations) {
    await pb.collection('generations').create({
      // ... маппинг полей
    });
  }
}
```

## Self-hosting PocketBase

### Docker

```dockerfile
FROM alpine:latest

ARG PB_VERSION=0.22.0

RUN apk add --no-cache \
    unzip \
    ca-certificates

ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

EXPOSE 8090

CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  pocketbase:
    image: ghcr.io/muchobien/pocketbase:latest
    container_name: pocketbase
    restart: unless-stopped
    ports:
      - "8090:8090"
    volumes:
      - ./pb_data:/pb_data
    environment:
      - POCKETBASE_ADMIN_EMAIL=admin@example.com
      - POCKETBASE_ADMIN_PASSWORD=your_secure_password
```

Запуск:
```bash
docker-compose up -d
```

## Backup и восстановление

### Создание backup

```bash
# Остановить PocketBase
# Скопировать папку pb_data
cp -r pb_data pb_data_backup_$(date +%Y%m%d)
```

### Восстановление

```bash
# Остановить PocketBase
# Восстановить папку pb_data
cp -r pb_data_backup_20240205 pb_data
# Запустить PocketBase
```

## Преимущества PocketBase

✅ **Простота**: Один исполняемый файл, не требует установки
✅ **Скорость**: Быстрая разработка с готовым Admin UI
✅ **Real-time**: Встроенная поддержка WebSocket subscriptions
✅ **Файлы**: Встроенное хранилище файлов
✅ **Auth**: Готовая аутентификация (email, OAuth2)
✅ **Self-hosted**: Полный контроль над данными
✅ **Бесплатно**: Open-source, без лимитов

## Следующие шаги

1. ✅ Установить и запустить PocketBase
2. ✅ Создать коллекции через Admin UI
3. ✅ Настроить `.env.local`
4. 🔄 Интегрировать с существующими компонентами
5. 🔄 Добавить аутентификацию пользователей
6. 🔄 Настроить real-time обновления

---

**Документация PocketBase**: https://pocketbase.io/docs/
