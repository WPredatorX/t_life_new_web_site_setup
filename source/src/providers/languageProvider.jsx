"use client";

import { useState, useEffect } from "react";
import { IntlProvider } from "react-intl";
import { useLanguage } from "@hooks";
import { APPLICATION_DEFAULT } from "@constants";
import { Transform } from "@utilities";

const LanguageProvider = ({ children }) => {
  const { language } = useLanguage();
  const [messages, setMessages] = useState();

  const loadLanguage = (locale) => {
    return import(`@constants/language/${locale}.json`);
  };

  const handleProviderLoad = async () => {
    const loadedData = await loadLanguage(language);
    const defaultMessage = loadedData.default;
    const flattenMessage = Transform.flatten(defaultMessage);
    setMessages(flattenMessage);
  };

  useEffect(() => {
    handleProviderLoad(language);
  }, [language]);

  return (
    <>
      {messages ? (
        <IntlProvider
          locale={language}
          defaultLocale={APPLICATION_DEFAULT.language}
          messages={messages}
        >
          {children}
        </IntlProvider>
      ) : null}
    </>
  );
};

export default LanguageProvider;
