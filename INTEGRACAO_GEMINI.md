# 🔌 Guia de Integração com Google Gemini 3 Pro

## Objetivo
Conectar o formulário médico com a API do Google Gemini 3 Pro para gerar planos de conteúdo reais baseados nos parâmetros fornecidos.

## 📋 Pré-requisitos

1. **API Key do Google Gemini**
   - Obter em: https://makersuite.google.com/app/apikey
   - Adicionar ao arquivo `.env.local`:
   ```bash
   GOOGLE_GEMINI_API_KEY=sua_chave_aqui
   ```

2. **Instalar SDK (se necessário)**
   ```bash
   npm install @google/generative-ai
   ```

## 🏗️ Estrutura de Implementação

### 1. Criar API Route
Criar arquivo: `/app/api/generate-medical-plan/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MedicalContentFormData } from '@/lib/types';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const formData: MedicalContentFormData = await request.json();
    
    // Construir o prompt
    const prompt = buildPrompt(formData);
    
    // Chamar Gemini 3 Pro
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parsear resposta
    const contentPlan = parseGeminiResponse(text);
    
    return NextResponse.json({ 
      success: true, 
      plan: contentPlan 
    });
    
  } catch (error) {
    console.error('Erro ao gerar plano:', error);
    return NextResponse.json(
      { success: false, error: 'Falha ao gerar plano' },
      { status: 500 }
    );
  }
}

function buildPrompt(data: MedicalContentFormData): string {
  const { specialization, month, goals, formatCounts, additionalContext, useHealthCalendar } = data;
  
  let prompt = `
Você é um especialista em marketing de conteúdo para profissionais de saúde no Instagram.

ESPECIALIZAÇÃO: ${specialization}
MÊS DO PLANO: ${month}
OBJETIVOS (em ordem de prioridade): ${goals.join(', ')}

DISTRIBUIÇÃO DE FORMATOS:
- Reels: ${formatCounts.reels}
- Carrossel: ${formatCounts.carrossel}
- Post Estático: ${formatCounts.postEstatico}
- Stories: ${formatCounts.stories}
- Live/Collab: ${formatCounts.liveCollab}

${additionalContext ? `CONTEXTO ADICIONAL: ${additionalContext}` : ''}

${useHealthCalendar ? `IMPORTANTE: Considere as datas de saúde relevantes para ${month} e ${specialization}.` : ''}

TAREFA:
Gere um plano de conteúdo detalhado para Instagram com EXATAMENTE a quantidade de posts especificada para cada formato.

Para cada post, forneça:
1. FORMATO: (Reels/Carrossel/Post Estático/Stories/Live)
2. TÍTULO: Título chamativo e relevante
3. PAIN POINT: Dor/problema que o post aborda
4. OUTLINE: Estrutura do conteúdo (3-5 tópicos)
5. CTA: Call-to-action específico

FORMATO DE RESPOSTA (JSON):
{
  "posts": [
    {
      "format": "Reels",
      "title": "...",
      "pain_point": "...",
      "content_outline": "...",
      "cta": "..."
    }
  ]
}
`;

  return prompt;
}

function parseGeminiResponse(text: string) {
  // Tentar extrair JSON da resposta
  try {
    // Remover markdown code blocks se existirem
    const jsonMatch = text.match(/\`\`\`json\n([\s\S]*?)\n\`\`\`/) || 
                      text.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const jsonStr = jsonMatch[1] || jsonMatch[0];
      return JSON.parse(jsonStr);
    }
    
    // Se não encontrar JSON, retornar texto bruto
    return { raw: text };
  } catch (error) {
    console.error('Erro ao parsear resposta:', error);
    return { raw: text };
  }
}
```

### 2. Atualizar o Componente MedicalContentForm

Modificar `/components/MedicalContentForm.tsx`:

```typescript
// No início do arquivo, adicionar:
interface GeneratedPost {
  format: string;
  title: string;
  pain_point: string;
  content_outline: string;
  cta: string;
}

// Na página /app/medical/page.tsx, modificar handleFormSubmit:

const handleFormSubmit = async (formData: MedicalContentFormData) => {
  setIsGenerating(true);
  
  try {
    const response = await fetch('/api/generate-medical-plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    if (!response.ok) {
      throw new Error('Falha na requisição');
    }
    
    const result = await response.json();
    
    if (result.success) {
      setGeneratedPlan(result.plan);
      alert('✅ Plano de conteúdo gerado com sucesso!');
    } else {
      throw new Error(result.error);
    }
    
  } catch (error) {
    console.error('Erro ao gerar plano:', error);
    alert('❌ Erro ao gerar plano. Tente novamente.');
  } finally {
    setIsGenerating(false);
  }
};
```

### 3. Salvar no Banco de Dados (Opcional)

Se quiser persistir os planos gerados:

```typescript
// Após gerar com sucesso, salvar no DB
const saveResponse = await fetch('/api/generations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    generation: {
      specialization: formData.specialization,
      purpose: formData.goals[0], // Objetivo principal
      content_type: 'Medical Instagram',
      number_of_publications: getTotalPublications(formData.formatCounts),
      context: formData.additionalContext,
      metadata: {
        month: formData.month,
        goals: formData.goals,
        formatCounts: formData.formatCounts,
        useHealthCalendar: formData.useHealthCalendar,
      }
    },
    items: result.plan.posts.map(post => ({
      format: post.format,
      title: post.title,
      pain_point: post.pain_point,
      content_outline: post.content_outline,
      cta: post.cta,
      status: 'draft',
    }))
  })
});
```

## 🎯 Prompt Engineering - Dicas

### Melhorar a Qualidade das Respostas

1. **Seja Específico sobre o Formato**
   ```
   "Gere EXATAMENTE ${total} posts no formato JSON válido"
   ```

2. **Forneça Exemplos**
   ```
   Exemplo de post:
   {
     "format": "Reels",
     "title": "5 Sinais de Alerta que Você Não Deve Ignorar",
     "pain_point": "Pacientes ignoram sintomas iniciais por medo ou desconhecimento",
     ...
   }
   ```

3. **Use Few-Shot Learning**
   - Inclua 1-2 exemplos completos no prompt
   - Gemini aprende o padrão e replica

4. **Adicione Restrições**
   ```
   - Títulos: máximo 60 caracteres
   - Pain points: foco em dores emocionais, não apenas físicas
   - CTAs: sempre incluir ação específica
   ```

## 🧪 Testes

### Teste Manual
1. Preencher formulário com dados reais
2. Clicar em "Gerar Plano"
3. Verificar:
   - ✅ Tempo de resposta (< 30s)
   - ✅ Qualidade do conteúdo
   - ✅ Quantidade correta de posts
   - ✅ Formato JSON válido

### Teste de Erro
1. Desconectar internet
2. Usar API key inválida
3. Verificar mensagens de erro

## 📊 Monitoramento

### Logs Importantes
```typescript
console.log('Iniciando geração:', {
  specialization: formData.specialization,
  totalPosts: getTotalPublications(formData.formatCounts),
  timestamp: new Date().toISOString()
});

console.log('Resposta Gemini:', {
  length: text.length,
  preview: text.substring(0, 100),
  timestamp: new Date().toISOString()
});
```

### Métricas a Acompanhar
- Tempo médio de geração
- Taxa de sucesso/erro
- Qualidade das respostas (feedback manual)
- Custo de API (tokens usados)

## 💰 Custos Estimados

**Gemini Pro (Free Tier):**
- 60 requisições/minuto
- Grátis até certo limite

**Gemini Pro (Pago):**
- ~$0.00025 por 1K caracteres de input
- ~$0.0005 por 1K caracteres de output

**Estimativa por geração:**
- Input: ~1K caracteres = $0.00025
- Output: ~5K caracteres = $0.0025
- **Total: ~$0.003 por plano**

## 🚀 Deploy

### Variáveis de Ambiente
```bash
# .env.local (desenvolvimento)
GOOGLE_GEMINI_API_KEY=...

# Vercel/Produção
# Adicionar via dashboard ou CLI:
vercel env add GOOGLE_GEMINI_API_KEY
```

### Verificação Pré-Deploy
- [ ] API key configurada
- [ ] Testes passando
- [ ] Error handling implementado
- [ ] Logs configurados
- [ ] Rate limiting considerado

## 📚 Recursos

- [Gemini API Docs](https://ai.google.dev/docs)
- [Prompt Engineering Guide](https://ai.google.dev/docs/prompt_best_practices)
- [SDK JavaScript](https://github.com/google/generative-ai-js)

---

**Próximo Passo:** Implementar a API route e testar com dados reais!
