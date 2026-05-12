import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
    const locale = 'en'; // Default locale; client-side switching handled by LanguageProvider
    const messages = (await import(`../../messages/${locale}.json`)).default;
    return { locale, messages, timeZone: 'Asia/Dubai' };
});
