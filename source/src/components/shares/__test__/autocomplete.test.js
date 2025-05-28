import { AppAutocomplete } from "@/components";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import { QueryClient, QueryClientProvider } from "react-query";

const renderWithIntlAndQuery = (component, locale = "en", messages = {}) => {
  const queryClient = new QueryClient();

  return render(
    <IntlProvider locale={locale} messages={messages}>
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    </IntlProvider>
  );
};

describe("AppAutocomplete", () => {
  it("should render without crashing", async () => {
    const { getByText } = renderWithIntlAndQuery(<AppAutocomplete />);
  });
  it("calls onBeforeOpen and shows loaded options", async () => {
    const onBeforeOpenMock = jest.fn().mockResolvedValue([
      { id: "1", label: "Option A" },
      { id: "2", label: "Option B" },
    ]);

    renderWithIntlAndQuery(
      <AppAutocomplete
        label="Async Label"
        onBeforeOpen={onBeforeOpenMock}
        value={null}
      />
    );

    const input = screen.getByLabelText("Async Label");
    fireEvent.mouseDown(input);

    await waitFor(() => {
      expect(onBeforeOpenMock).toHaveBeenCalled();
    });

    // Check if options were rendered
    await waitFor(() => {
      expect(screen.getByText("Option A")).toBeInTheDocument();
    });
  });
  it("displays helper text on error", () => {
    renderWithIntlAndQuery(
      <AppAutocomplete
        label="With Error"
        error={true}
        helperText="This is an error"
        options={[]}
      />
    );
    expect(screen.getByText("This is an error")).toBeInTheDocument();
  });
  it("sets async options on success", async () => {
    const asyncOptions = [{ id: "3", label: "Loaded Option" }];
    const onBeforeOpenMock = jest.fn().mockResolvedValue(asyncOptions);

    renderWithIntlAndQuery(
      <AppAutocomplete label="Load Options" onBeforeOpen={onBeforeOpenMock} />
    );

    // simulate opening
    fireEvent.mouseDown(screen.getByLabelText("Load Options"));

    // wait for option to appear
    await waitFor(() => {
      expect(screen.getByText("Loaded Option")).toBeInTheDocument();
    });
  });
  it("renders tags when multiple values are selected", () => {
    const value = [
      { id: "1", label: "Tag One" },
      { id: "2", label: "Tag Two" },
    ];

    renderWithIntlAndQuery(
      <AppAutocomplete label="Tags" multiple value={value} options={value} />
    );

    expect(screen.getByText("Tag One")).toBeInTheDocument();
    expect(screen.getByText("Tag Two")).toBeInTheDocument();
  });
  it("returns empty array when onBeforeOpen is not provided", async () => {
    renderWithIntlAndQuery(<AppAutocomplete label="No onBeforeOpen" />);

    const input = screen.getByLabelText("No onBeforeOpen");
    fireEvent.mouseDown(input);

    // ไม่มี error และไม่ crash คือผ่าน
    await waitFor(() => {
      expect(screen.getByText("ไม่พบข้อมูล")).toBeInTheDocument(); // noOptionsText
    });
  });
});
