import PageProductsDetail from "@/components/pages/page-product-detail";

const ProductDetail = ({
  searchParams: { mode, type, i_package, plan_code, product_plan_id },
}) => {
  return (
    <PageProductsDetail
      productId={plan_code}
      i_package={i_package}
      product_plan_id={product_plan_id}
      mode={mode}
      type={type}
    />
  );
};

export default ProductDetail;
