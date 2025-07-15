import { setLanguage } from "@stores/slices";
import { useAppDispatch, useAppSelector } from "@hooks";

const useLanguage = () => {
  const dispatch = useAppDispatch();
  const { language } = useAppSelector((state) => state.global);

  const handleChangeLanguage = (lang) => {
    dispatch(setLanguage(lang));
  };

  return { language, handleChangeLanguage };
};

export default useLanguage;
