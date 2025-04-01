import {
  AppProductSalePaidCategory,
  AppProductSalePaidType,
  AppProductSalePrepayment,
  AppProductSaleRange,
  AppProductSaleTemplate,
} from "./components";

const AppCardDataGrid = ({ mode, formMethods, productId }) => {
  switch (mode) {
    case 1:
      return (
        <AppProductSaleRange formMethods={formMethods} productId={productId} />
      );
    case 2:
      return (
        <AppProductSalePaidType
          formMethods={formMethods}
          productId={productId}
        />
      );
    case 3:
      return (
        <AppProductSalePaidCategory
          formMethods={formMethods}
          productId={productId}
        />
      );
    case 4:
      return (
        <AppProductSalePrepayment
          formMethods={formMethods}
          productId={productId}
        />
      );
    case 5:
      return (
        <AppProductSaleTemplate
          formMethods={formMethods}
          productId={productId}
        />
      );
    default:
      return <></>;
  }
};
export default AppCardDataGrid;
