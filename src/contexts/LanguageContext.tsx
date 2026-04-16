import React, { createContext, useContext, useState } from 'react';
import { useI18n } from '../hooks/useI18n';
import { useTranslations } from '../hooks/useTranslations';
import type { I18nData } from '../types/i18n';
import { TranslationData } from 'types/translations';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  i18n: I18nData[];
  t: TranslationData;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function getDefaultLanguage(i18n: I18nData[] | null): string {
  if (!i18n || i18n.length === 0) return 'fr';
  const defaultLang = i18n.find(lang => lang.isDefault);
  return defaultLang?.code || 'fr';
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Récupération des langues dispo et la langue par défaut
  const i18n = useI18n() ?? [];
  const defaultLanguage = getDefaultLanguage(i18n);
  
  // State pour la langue courante
  const [language, setLanguage] = useState<string>(defaultLanguage);
  
  // Hook de traduction
  const t = useTranslations(language);

  // Valeur du contexte
  const contextValue: LanguageContextType = {
    language,
    setLanguage,
    i18n,
    t
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  
  if (!context) {
    throw new Error(
      'useLanguage must be used within a LanguageProvider'
    );
  }
  
  return context;
};
