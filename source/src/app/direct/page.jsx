import { Direct } from "./components";

const PageDireact = ({ searchParams: { tabIndex, promotionCode } }) => {
  return <Direct tabIndex={tabIndex} promotionCode={promotionCode} />;
};

export default PageDireact;
