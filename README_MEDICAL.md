# Gerador de Conteúdo Médico para Instagram

Sistema inteligente de planejamento de conteúdo para profissionais de saúde no Instagram, powered by Google Gemini 3 Pro.

## 🎯 Funcionalidades Principais

### MVP - Planejamento Médico para Instagram

#### 1. **Especialização Médica**
Suporte para 10 especialidades principais:
- Mamografia/Mastologia
- Odontologia
- Ginecologia e Obstetrícia
- Dermatologia
- Pediatria
- Cardiologia
- Ortopedia
- Oftalmologia
- Endocrinologia
- Nutrologia/Nutrição

#### 2. **Objetivos de Conteúdo (Priorizáveis)**
Sistema de multi-seleção com ordenação por prioridade:
1. **Conversão** - Foco em gerar leads e conversões
2. **Autoridade** - Estabelecer expertise e credibilidade
3. **Crescimento** - Aumentar alcance e seguidores
4. **Educação** - Educar e informar o público
5. **Engajamento** - Aumentar interação e participação

**Lógica:** O primeiro objetivo selecionado é o driver principal (70% de peso na distribuição automática).

#### 3. **Formatos Instagram**
Distribuição inteligente entre 5 formatos:
- **Reels** - Vídeo dinâmico para alcance e análise de dor
- **Carrossel** - Slides educacionais para autoridade
- **Post Estático** - Imagem fixa para branding
- **Stories** - Atualizações sequenciais para conversão
- **Live/Collab** - Networking e confiança em tempo real

#### 4. **Auto-distribuir (IA)**
Função inteligente que distribui automaticamente os formatos baseado nos objetivos selecionados:
- **Conversão** → Prioriza Stories (15) e Reels (6)
- **Autoridade** → Prioriza Carrossel (10) e Post Estático (5)
- **Crescimento** → Prioriza Reels (12) para viralidade
- **Educação** → Prioriza Carrossel (12) para conteúdo detalhado
- **Engajamento** → Distribui equilibradamente com foco em Stories (10)

#### 5. **Calendário de Saúde 2025**
Sincronização automática com datas importantes:
- **Janeiro Branco** (Saúde Mental)
- **Outubro Rosa** (Câncer de Mama)
- **Novembro Azul** (Saúde do Homem)
- **Dezembro Laranja** (Câncer de Pele)
- E muitas outras datas específicas por especialização

**Feature:** Preview de "Próximas Datas" mostra eventos relevantes ao ativar o toggle.

#### 6. **Contexto Adicional Inteligente**
Placeholders dinâmicos que mudam baseado na especialização:
- **Odontologia:** "Ex: Possui microscópio, oferece parcelamento..."
- **Mamografia:** "Ex: Equipamento digital, atendimento humanizado..."
- **Pediatria:** "Ex: Atendimento domiciliar, urgências..."

#### 7. **UX Otimizado**
- ✅ Validação em tempo real
- ✅ Botão "Gerar Plano" ativo apenas quando Especialização + Mês + Objetivos estão preenchidos
- ✅ Reset completo da forma
- ✅ Total de publicações calculado automaticamente
- ✅ Drag-and-drop para reordenar objetivos (prioridade)

## 🏗️ Arquitetura

```
/app
  /medical          # Página do planejamento médico
  page.tsx          # Página principal (planejamento geral)
  layout.tsx        # Layout global
  globals.css       # Estilos globais

/components
  MedicalContentForm.tsx    # Formulário principal do MVP
  ContentPlanForm.tsx       # Formulário legado (geral)
  Navigation.tsx            # Navegação entre páginas
  /ui                       # Componentes UI reutilizáveis

/lib
  types.ts                  # Tipos TypeScript
  healthCalendar.ts         # Base de dados do calendário 2025
  formatDistribution.ts     # Lógica de auto-distribuição
  i18n.tsx                  # Sistema de internacionalização
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev
```

Acesse: `http://localhost:3000/medical`

### Build para Produção

```bash
npm run build
npm start
```

## 📋 Estrutura de Dados

### MedicalContentFormData
```typescript
{
  specialization: MedicalSpecialization;  // Especialização médica
  month: MonthOption;                     // Mês do planejamento
  goals: ContentGoal[];                   // Objetivos ordenados por prioridade
  formatCounts: {                         // Quantidade de cada formato
    reels: number;
    carrossel: number;
    postEstatico: number;
    stories: number;
    liveCollab: number;
  };
  additionalContext: string;              // Contexto adicional
  useHealthCalendar: boolean;             // Sincronizar com calendário
}
```

## 🎨 Design Principles

1. **Progressive Disclosure** - Informações avançadas (datas do calendário) aparecem apenas quando relevantes
2. **Smart Defaults** - Auto-distribuição baseada em objetivos
3. **Validation First** - Validação clara e em tempo real
4. **Context-Aware** - Placeholders e sugestões mudam baseado no contexto
5. **Priority-Driven** - Primeiro objetivo é o driver principal

## 🔮 Próximos Passos

### Integração com Gemini 3 Pro
```typescript
// TODO: Implementar chamada real à API
const response = await fetch('/api/generate-plan', {
  method: 'POST',
  body: JSON.stringify(formData)
});
```

### Funcionalidades Futuras
- [ ] Exportar plano para PDF
- [ ] Salvar planos no banco de dados
- [ ] Histórico de planos gerados
- [ ] Edição de posts individuais
- [ ] Agendamento automático
- [ ] Analytics de performance

## 📝 Notas Técnicas

### Lógica de Auto-distribuição
A função `autoDistributeFormats()` usa um sistema de pesos:
- **Objetivo Principal (1º):** 70% de influência
- **Objetivos Secundários:** 30% divididos igualmente

Exemplo com 2 objetivos [Conversão, Autoridade]:
- Conversão (70%): Stories=15, Reels=6
- Autoridade (30%): Carrossel=10, Post=5
- **Resultado:** Mix otimizado entre conversão e autoridade

### Calendário de Saúde
Base de dados estática em `healthCalendar.ts` com:
- 20+ eventos de saúde em 2025
- Filtros por mês e especialização
- Função `getUpcomingHealthEvents()` para próximas datas

## 🌐 Internacionalização

Suporte para:
- 🇧🇷 Português (Brasil) - Padrão
- 🇺🇸 English

Adicionar novos idiomas em `/lib/i18n.tsx`

## 📄 Licença

ISC

---

**Desenvolvido com ❤️ para profissionais de saúde que querem dominar o Instagram**
