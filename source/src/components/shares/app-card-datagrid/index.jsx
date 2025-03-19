import {
  AppProductSalePaidCategory,
  AppProductSalePaidType,
  AppProductSalePrepayment,
  AppProductSaleRange,
  AppProductSaleTemplate,
} from "./components";

const AppCardDataGrid = ({ mode, formMethods }) => {
  switch (mode) {
    case 1:
      return <AppProductSaleRange formMethods={formMethods} />;
    case 2:
      return <AppProductSalePaidType formMethods={formMethods} />;
    case 3:
      return <AppProductSalePaidCategory formMethods={formMethods} />;
    case 4:
      return <AppProductSalePrepayment formMethods={formMethods} />;
    case 5:
      return <AppProductSaleTemplate formMethods={formMethods} />;
    default:
      return <></>;
  }
};
export default AppCardDataGrid;
