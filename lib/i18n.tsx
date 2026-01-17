"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Locale = "en" | "pt-BR";

const LOCALE_STORAGE_KEY = "cp_locale";
const DEFAULT_LOCALE: Locale = "en";

const translations = {
  en: {
    "app.title": "Content Plan Generator",
    "app.subtitle": "Manage content plan generations",
    "app.createGeneration": "Create generation",
    "nav.language": "Language",
    "nav.language.en": "English",
    "nav.language.ptBr": "Portuguese (Brazil)",
    "sidebar.generations": "Generations",
    "generations.loading": "Loading...",
    "generations.error": "Error: {error}",
    "generations.loadError": "Failed to load generations",
    "generations.retry": "Try again",
    "generations.empty.title": "No generations yet.",
    "generations.empty.subtitle": "Create the first one!",
    "generations.publications.one": "{count} publication",
    "generations.publications.other": "{count} publications",
    "posts.selectGeneration": "Select a generation on the left",
    "posts.loading": "Loading posts...",
    "posts.error": "Error: {error}",
    "posts.loadError": "Failed to load items",
    "posts.updateStatusError": "Failed to update item status. Please try again.",
    "posts.updateItemError": "Failed to update item: {error}",
    "posts.count.one": "{count} post",
    "posts.count.other": "{count} posts",
    "posts.view.table": "Table",
    "posts.view.calendar": "Calendar",
    "posts.settings": "Settings",
    "settings.tableView": "Table view",
    "settings.calendarView": "Calendar view",
    "settings.format": "Format",
    "settings.status": "Status",
    "settings.publishDate": "Publish date",
    "settings.approved": "Approved",
    "settings.undatedSection": "Undated section",
    "table.empty.title": "No content plan items yet.",
    "table.empty.subtitle": "Generate a content plan to see items here.",
    "table.columns.title": "Title",
    "table.columns.format": "Format",
    "table.columns.status": "Status",
    "table.columns.publishDate": "Publish date",
    "table.columns.approved": "Approved",
    "table.columns.painPoint": "Pain point",
    "table.columns.cta": "CTA",
    "table.columns.contentOutline": "Content outline",
    "table.columns.actions": "Actions",
    "table.actions.view": "View",
    "table.actions.comingSoon": "Actions coming soon",
    "table.approved.yes": "Yes",
    "table.approved.no": "No",
    "table.filter.approval": "Approval",
    "table.filter.all": "All",
    "table.filter.approved": "Approved",
    "table.filter.disapproved": "Disapproved",
    "table.selectAll": "Select all items",
    "table.selectItem": "Select {title}",
    "modal.title": "Edit item",
    "modal.labels.title": "Title",
    "modal.labels.format": "Format",
    "modal.labels.status": "Status",
    "modal.labels.publishDate": "Planned publish date",
    "modal.labels.painPoint": "Pain point",
    "modal.labels.contentOutline": "Content outline",
    "modal.labels.cta": "CTA",
    "modal.approved": "Approved",
    "modal.cancel": "Cancel",
    "modal.save": "Save",
    "modal.saving": "Saving...",
    "status.draft": "draft",
    "status.selected": "selected",
    "status.generated": "generated",
    "calendar.view.month": "Month",
    "calendar.view.week": "Week",
    "calendar.today": "Today",
    "calendar.more": "+{count} more",
    "calendar.noPublishDate": "No publish date",
    "generationModal.title": "Generate Content Plan",
    "generationModal.createError": "Failed to create generation: {error}",
    "generationModal.createErrorFallback": "Failed to create generation",
    "generationModal.genericError": "Error: {error}",
    "form.labels.specialization": "Specialization",
    "form.labels.purpose": "Purpose of publication",
    "form.labels.contentType": "Type of content",
    "form.labels.numberOfPublications": "Number of publications",
    "form.labels.context": "Context / wishes",
    "form.placeholder.context":
      "Enter any additional context, specific requirements, or wishes for your content plan...",
    "form.submit.generate": "Generate content plan",
    "form.submit.generating": "Generating...",
    "form.errors.specializationRequired": "Specialization is required",
    "form.errors.purposeRequired": "Purpose of publication is required",
    "form.errors.contentTypeRequired": "Type of content is required",
    "form.errors.publicationsRange": "Number of publications must be between 1 and 15",
    "options.specialization.digitalMarketing": "Digital Marketing",
    "options.specialization.saas": "SaaS",
    "options.specialization.ecommerce": "E-commerce",
    "options.specialization.healthcare": "Healthcare",
    "options.specialization.education": "Education",
    "options.specialization.finance": "Finance",
    "options.specialization.technology": "Technology",
    "options.specialization.realEstate": "Real Estate",
    "options.purpose.leadGeneration": "Lead Generation",
    "options.purpose.brandAwareness": "Brand Awareness",
    "options.purpose.thoughtLeadership": "Thought Leadership",
    "options.purpose.customerEducation": "Customer Education",
    "options.purpose.productLaunch": "Product Launch",
    "options.purpose.customerRetention": "Customer Retention",
    "options.purpose.communityBuilding": "Community Building",
    "options.contentType.educational": "Educational",
    "options.contentType.promotional": "Promotional",
    "options.contentType.entertainment": "Entertainment",
    "options.contentType.caseStudy": "Case Study",
    "options.contentType.howToGuide": "How-to Guide",
    "options.contentType.newsUpdates": "News & Updates",
    "options.contentType.comparison": "Comparison",
    "options.contentType.review": "Review",
    "ui.close": "Close",
    "ui.closeModal": "Close modal",
  },
  "pt-BR": {
    "app.title": "Gerador de Plano de Conteudo",
    "app.subtitle": "Gerencie geracoes de planos de conteudo",
    "app.createGeneration": "Criar geracao",
    "nav.language": "Idioma",
    "nav.language.en": "Ingles",
    "nav.language.ptBr": "Portugues (Brasil)",
    "sidebar.generations": "Geracoes",
    "generations.loading": "Carregando...",
    "generations.error": "Erro: {error}",
    "generations.loadError": "Falha ao carregar geracoes",
    "generations.retry": "Tentar novamente",
    "generations.empty.title": "Nenhuma geracao ainda.",
    "generations.empty.subtitle": "Crie a primeira!",
    "generations.publications.one": "{count} publicacao",
    "generations.publications.other": "{count} publicacoes",
    "posts.selectGeneration": "Selecione uma geracao a esquerda",
    "posts.loading": "Carregando posts...",
    "posts.error": "Erro: {error}",
    "posts.loadError": "Falha ao carregar itens",
    "posts.updateStatusError": "Falha ao atualizar o status do item. Tente novamente.",
    "posts.updateItemError": "Falha ao atualizar o item: {error}",
    "posts.count.one": "{count} post",
    "posts.count.other": "{count} posts",
    "posts.view.table": "Tabela",
    "posts.view.calendar": "Calendario",
    "posts.settings": "Configuracoes",
    "settings.tableView": "Visualizacao da tabela",
    "settings.calendarView": "Visualizacao do calendario",
    "settings.format": "Formato",
    "settings.status": "Status",
    "settings.publishDate": "Data de publicacao",
    "settings.approved": "Aprovado",
    "settings.undatedSection": "Secao sem data",
    "table.empty.title": "Nenhum item de plano de conteudo ainda.",
    "table.empty.subtitle": "Gere um plano de conteudo para ver itens aqui.",
    "table.columns.title": "Titulo",
    "table.columns.format": "Formato",
    "table.columns.status": "Status",
    "table.columns.publishDate": "Data de publicacao",
    "table.columns.approved": "Aprovado",
    "table.columns.painPoint": "Pain point",
    "table.columns.cta": "CTA",
    "table.columns.contentOutline": "Content outline",
    "table.columns.actions": "Acoes",
    "table.actions.view": "Ver",
    "table.actions.comingSoon": "Acoes em breve",
    "table.approved.yes": "Sim",
    "table.approved.no": "Nao",
    "table.filter.approval": "Aprovacao",
    "table.filter.all": "Todos",
    "table.filter.approved": "Aprovado",
    "table.filter.disapproved": "Nao aprovado",
    "table.selectAll": "Selecionar todos os itens",
    "table.selectItem": "Selecionar {title}",
    "modal.title": "Editar item",
    "modal.labels.title": "Titulo",
    "modal.labels.format": "Formato",
    "modal.labels.status": "Status",
    "modal.labels.publishDate": "Data prevista de publicacao",
    "modal.labels.painPoint": "Pain point",
    "modal.labels.contentOutline": "Content outline",
    "modal.labels.cta": "CTA",
    "modal.approved": "Aprovado",
    "modal.cancel": "Cancelar",
    "modal.save": "Salvar",
    "modal.saving": "Salvando...",
    "status.draft": "rascunho",
    "status.selected": "selecionado",
    "status.generated": "gerado",
    "calendar.view.month": "Mes",
    "calendar.view.week": "Semana",
    "calendar.today": "Hoje",
    "calendar.more": "+{count} mais",
    "calendar.noPublishDate": "Sem data de publicacao",
    "generationModal.title": "Gerar plano de conteudo",
    "generationModal.createError": "Falha ao criar geracao: {error}",
    "generationModal.createErrorFallback": "Falha ao criar geracao",
    "generationModal.genericError": "Erro: {error}",
    "form.labels.specialization": "Especializacao",
    "form.labels.purpose": "Objetivo da publicacao",
    "form.labels.contentType": "Tipo de conteudo",
    "form.labels.numberOfPublications": "Numero de publicacoes",
    "form.labels.context": "Contexto / desejos",
    "form.placeholder.context":
      "Informe qualquer contexto adicional, requisitos especificos ou desejos para seu plano de conteudo...",
    "form.submit.generate": "Gerar plano de conteudo",
    "form.submit.generating": "Gerando...",
    "form.errors.specializationRequired": "Especializacao obrigatoria",
    "form.errors.purposeRequired": "Objetivo da publicacao obrigatorio",
    "form.errors.contentTypeRequired": "Tipo de conteudo obrigatorio",
    "form.errors.publicationsRange": "Numero de publicacoes deve ser entre 1 e 15",
    "options.specialization.digitalMarketing": "Marketing Digital",
    "options.specialization.saas": "SaaS",
    "options.specialization.ecommerce": "E-commerce",
    "options.specialization.healthcare": "Saude",
    "options.specialization.education": "Educacao",
    "options.specialization.finance": "Financas",
    "options.specialization.technology": "Tecnologia",
    "options.specialization.realEstate": "Imoveis",
    "options.purpose.leadGeneration": "Geracao de leads",
    "options.purpose.brandAwareness": "Reconhecimento de marca",
    "options.purpose.thoughtLeadership": "Lideranca de pensamento",
    "options.purpose.customerEducation": "Educacao do cliente",
    "options.purpose.productLaunch": "Lancamento de produto",
    "options.purpose.customerRetention": "Retencao de clientes",
    "options.purpose.communityBuilding": "Construcao de comunidade",
    "options.contentType.educational": "Educacional",
    "options.contentType.promotional": "Promocional",
    "options.contentType.entertainment": "Entretenimento",
    "options.contentType.caseStudy": "Estudo de caso",
    "options.contentType.howToGuide": "Guia passo a passo",
    "options.contentType.newsUpdates": "Noticias e atualizacoes",
    "options.contentType.comparison": "Comparacao",
    "options.contentType.review": "Analise",
    "ui.close": "Fechar",
    "ui.closeModal": "Fechar modal",
  },
} as const;

type TranslationKey = keyof typeof translations.en;

const weekDaysByLocale: Record<Locale, string[]> = {
  en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  "pt-BR": ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"],
};

const isLocale = (value: string | null): value is Locale =>
  value === "en" || value === "pt-BR";

const getIntlLocale = (locale: Locale) => (locale === "pt-BR" ? "pt-BR" : "en-US");

const interpolate = (template: string, vars?: Record<string, string | number>) => {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    key in vars ? String(vars[key]) : `{${key}}`
  );
};

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
  intlLocale: string;
  weekDays: string[];
};

const I18nContext = createContext<I18nContextValue | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isLocale(stored)) {
      setLocale(stored);
      return;
    }
    if (typeof navigator !== "undefined") {
      const browserLocale = navigator.language.toLowerCase();
      if (browserLocale.startsWith("pt")) {
        setLocale("pt-BR");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    if (typeof document !== "undefined") {
      document.documentElement.lang = getIntlLocale(locale);
    }
  }, [locale]);

  const value = useMemo<I18nContextValue>(() => {
    const t = (key: TranslationKey, vars?: Record<string, string | number>) => {
      const template = translations[locale][key] ?? translations.en[key];
      return interpolate(template, vars);
    };
    return {
      locale,
      setLocale,
      t,
      intlLocale: getIntlLocale(locale),
      weekDays: weekDaysByLocale[locale],
    };
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within LanguageProvider");
  }
  return context;
};
