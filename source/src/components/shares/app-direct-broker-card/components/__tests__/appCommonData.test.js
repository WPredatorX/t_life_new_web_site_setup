import { AppCommonData } from "..";
import { render } from "@testing-library/react";
jest.mock("@/hooks", () => ({
  useAppSelector: jest.fn(() => ({
    activator: "me",
  })),
  useAppForm: jest.fn(),
  useAppSnackbar: jest.fn(() => ({
    handleSnackAlert: jest.fn(),
  })),
  useAppDialog: jest.fn(() => ({
    handleNotification: jest.fn(),
    handleConfirm: jest.fn(),
    handleClose: jest.fn(),
  })),
  useAppRouter: jest.fn(),
  useAppFeatureCheck: jest.fn(() => ({ validFeature: true })),
  useAppForm: jest.fn(() => ({
    watch: jest.fn(),
    control: jest.fn(),
    register: jest.fn(),
    reset: jest.fn(),
    setValue: jest.fn(),
    formState: { errors: {}, isDirty: false },
    handleSubmit: jest.fn(),
  })),
}));
const mockBrokerProfile = {
  generalInfo: "test",
  confirmEmail: "testEmail@test.com",
  confirmEmailCC: "testEmail@test.com",
  contactEmail: "testEmail@test.com",
  contactEmailCC: "testEmail@test.com",
};
describe("AppCommonData", () => {
  it("Should render with out crash", () => {
    render(<AppCommonData mode={"direct"} brokerData={mockBrokerProfile} />);
  });
});
