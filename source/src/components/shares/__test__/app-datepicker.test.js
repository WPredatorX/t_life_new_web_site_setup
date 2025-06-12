import { render, screen, fireEvent } from "@testing-library/react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import AppDatePicker from "../app-datepicker";
import DatePickerActionBar from "../app-datepicker/datepickerActionbar";
import { useMediaQuery } from "@mui/material";

jest.mock("@mui/material", () => {
  const actual = jest.requireActual("@mui/material");
  return {
    ...actual,
    useMediaQuery: jest.fn(),
  };
});

jest.mock("@mui/x-date-pickers", () => {
  const actual = jest.requireActual("@mui/x-date-pickers");
  return {
    ...actual,
    DesktopDateTimePicker: ({ renderInput, ...props }) => (
      <div data-testid="desktop-picker">
        {renderInput({ inputProps: {}, ...props })}
      </div>
    ),
    MobileDateTimePicker: ({ renderInput, ...props }) => (
      <div data-testid="mobile-picker">
        {renderInput({ inputProps: {}, ...props })}
      </div>
    ),
  };
});

describe("AppDatePicker with date-fns", () => {
  it("renders correctly", () => {
    useMediaQuery.mockReturnValue(true);
    const onChange = jest.fn();

    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AppDatePicker />
      </LocalizationProvider>
    );

    expect(screen.getByTestId("desktop-picker")).toBeInTheDocument();
  });

  it("renders correctly with props", () => {
    useMediaQuery.mockReturnValue(true);
    const onChange = jest.fn();

    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AppDatePicker
          id="test-date"
          name="test-date"
          label="Test Date"
          value={new Date()}
          onChange={onChange}
        />
      </LocalizationProvider>
    );

    expect(screen.getByTestId("desktop-picker")).toBeInTheDocument();
    expect(screen.getByLabelText("Test Date")).toBeInTheDocument();
  });
});

describe("DatePickerActionBar", () => {
  it("should render both buttons with correct text and icons", () => {
    const { getByText } = render(
      <DatePickerActionBar onClear={jest.fn()} onSetToday={jest.fn()} />
    );

    expect(getByText("วันนี้")).toBeInTheDocument();
    expect(getByText("ล้างค่า")).toBeInTheDocument();
  });

  it("should call onSetToday when 'วันนี้' button is clicked", () => {
    const mockOnSetToday = jest.fn();
    const { getByText } = render(
      <DatePickerActionBar onClear={jest.fn()} onSetToday={mockOnSetToday} />
    );

    fireEvent.click(getByText("วันนี้"));
    expect(mockOnSetToday).toHaveBeenCalledTimes(1);
  });

  it("should call onClear when 'ล้างค่า' button is clicked", () => {
    const mockOnClear = jest.fn();
    const { getByText } = render(
      <DatePickerActionBar onClear={mockOnClear} onSetToday={jest.fn()} />
    );

    fireEvent.click(getByText("ล้างค่า"));
    expect(mockOnClear).toHaveBeenCalledTimes(1);
  });
});
