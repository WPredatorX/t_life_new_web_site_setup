import { render } from "@testing-library/react";
import { AppProductSaleTemplate } from "..";
import { StoreProvider } from "@/providers";

jest.mock("react-hook-form", () => {
  const actual = jest.requireActual("react-hook-form");
  return {
    ...actual,
    useForm: jest.fn(() => ({
      register: jest.fn(),
      handleSubmit: (cb) => cb,
      formState: { errors: {} },
      control: {}, // ใส่ mock control object ตรงนี้
    })),
    Controller: ({ render }) =>
      render({ field: { onChange: jest.fn(), value: "" } }),
  };
});
// Mock hooks
jest.mock("@/hooks", () => ({
  useAppForm: jest.fn(),
  useAppSnackbar: jest.fn(),
  useAppDialog: jest.fn(),
  useAppRouter: jest.fn(),
  useAppFeatureCheck: jest.fn(),
  useAppSelector: jest.fn(),
}));

describe("AppProductSaleTemplate", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <StoreProvider>
        <AppProductSaleTemplate />
      </StoreProvider>
    );
    expect(container).toBeInTheDocument();
  });
});
