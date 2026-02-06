# 🧪 Создание тестовых контент-планов

Генерация уже создана! Теперь добавьте несколько контент-планов вручную через Admin UI.

## 📝 Генерация: Cardiologia (ID: jrwt6rbihqws5d6)

### Контент-план 1

1. Откройте коллекцию `content_plan_items` в Admin UI
2. Нажмите **+ New record**
3. Заполните поля:

```
generationId:     jrwt6rbihqws5d6  (выберите из списка)
title:            5 Sinais de Alerta do Coração
format:           Carrossel
status:           selected
publishDate:      2026-03-05
approved:         ✅ true
painPoint:        Medo de infarto
cta:              Agende sua consulta preventiva
contentOutline:   Slide 1: Dor no peito
                  Slide 2: Falta de ar
                  Slide 3: Palpitações
```

4. **Save**

### Контент-план 2

```
generationId:     jrwt6rbihqws5d6
title:            Como Medir Sua Pressão em Casa
format:           Reels
status:           selected
publishDate:      2026-03-08
approved:         ✅ true
painPoint:        Dúvidas sobre medição correta
cta:              Baixe nosso guia gratuito
contentOutline:   Passo a passo visual de medição
```

### Контент-план 3

```
generationId:     jrwt6rbihqws5d6
title:            Alimentos que Protegem o Coração
format:           Carrossel
status:           draft
publishDate:      2026-03-12
approved:         ❌ false
painPoint:        Alimentação inadequada
cta:              Consulte nosso nutricionista
contentOutline:   Peixes, nozes, azeite, frutas
```

---

## ✅ Готово!

После создания 3 контент-планов у вас будет полный набор тестовых данных для проверки интерфейса!

**Не забудьте вернуть API Rules:**
- Create: `@request.auth.id != ""`
- Update: `@request.auth.id != ""`
- Delete: `@request.auth.id != ""`
