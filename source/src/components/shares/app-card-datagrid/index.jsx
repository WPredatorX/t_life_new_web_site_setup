import {
  AppProductSalePaidCategory,
  AppProductSalePaidType,
  AppProductSalePrepayment,
  AppProductSaleRange,
  AppProductSaleTemplate,
} from "./components";

const AppCardDataGrid = ({ mode, formMethods, productId, preventInput }) => {
  switch (mode) {
    case 1:
      return (
        <AppProductSaleRange
          preventInput={preventInput}
          dataForm={{ ...formMethods }}
          productId={productId}
        />
      );
    case 2:
      return (
        <AppProductSalePaidType
          preventInput={preventInput}
          dataForm={{ ...formMethods }}
          productId={productId}
        />
      );
    case 3:
      return (
        <AppProductSalePaidCategory
          preventInput={preventInput}
          dataForm={{ ...formMethods }}
          productId={productId}
        />
      );
    case 4:
      return (
        <AppProductSalePrepayment
          preventInput={preventInput}
          dataForm={{ ...formMethods }}
          productId={productId}
        />
      );
    case 5:
      return (
        <AppProductSaleTemplate
          preventInput={preventInput}
          dataForm={{ ...formMethods }}
          productId={productId}
        />
      );
    default:
      return <></>;
  }
};
export default AppCardDataGrid;
