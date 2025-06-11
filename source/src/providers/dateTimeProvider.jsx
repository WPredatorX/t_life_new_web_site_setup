import { LocalizationProvider } from "@mui/x-date-pickers";
import { useLanguage } from "@hooks";
import { AdapterDateFns as GregorianCalendar } from "@mui/x-date-pickers/AdapterDateFns";
import { th as LocaleTH, enUS as LocaleEN } from "date-fns/locale";
import BuddhistCalendar from "@tarzui/date-fns-be";

const DateTimeProvider = ({ children }) => {
  const { language } = useLanguage();
  const CalendarMapper = {
    th: {
      calendar: BuddhistCalendar,
      locale: LocaleTH,
    },
    en: {
      calendar: GregorianCalendar,
      locale: LocaleEN,
    },
  };
  const dateAdapter = CalendarMapper[`${language.toLowerCase()}`];

  return (
    <LocalizationProvider
      dateAdapter={dateAdapter.calendar}
      adapterLocale={dateAdapter.locale}
    >
      {children}
    </LocalizationProvider>
  );
};

export default DateTimeProvider;
