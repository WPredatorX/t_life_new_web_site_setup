import PageProductsDetail from "@/components/pages/page-product-detail";

const ProductDetail = ({
  params: { productId, i_package },
  searchParams: { mode, type },
}) => {
  return (
    <PageProductsDetail
      productId={productId}
      i_package={i_package}
      mode={mode}
      type={type}
    />
  );
};

export default ProductDetail;
