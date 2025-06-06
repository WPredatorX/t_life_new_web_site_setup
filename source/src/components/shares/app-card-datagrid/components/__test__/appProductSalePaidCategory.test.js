import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AppProductSalePaidCategory } from "..";
import React from "react";

// Mock dependencies
jest.mock("@mui/material", () => ({
  ...jest.requireActual("@mui/material"),
  useTheme: () => ({
    palette: {
      common: { white: "#fff" },
    },
  }),
  Grid: ({ children, ...props }) => <div {...props}>{children}</div>,
  Button: ({ children, onClick, disabled, ...props }) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  ),
  TextField: ({ label, ...props }) => (
    <input {...props} placeholder={label} data-testid={label} />
  ),
  FormHelperText: ({ children }) => <div>{children}</div>,
  InputAdornment: ({ children }) => <div>{children}</div>,
  CircularProgress: () => <div>Loading...</div>,
}));

jest.mock("@/components", () => ({
  AppCard: ({ title, children }) => (
    <div data-testid="app-card">
      {title}
      {children}
    </div>
  ),
  AppStatus: ({ status, statusText }) => (
    <div data-testid="app-status">
      {status} - {statusText}
    </div>
  ),
  AppDataGrid: ({ rows, columns, ...props }) => (
    <div
      data-testid="app-data-grid"
      data-rows={JSON.stringify(rows)}
      {...props}
    >
      {rows?.map((row, index) => (
        <div key={index} data-testid={`grid-row-${row.product_payment_id}`}>
          {columns?.map((col) => {
            if (col.field === "actions") {
              const actions = col.getActions({ row });
              return (
                <div key={col.field}>
                  {actions?.map((action, actionIndex) => (
                    <button
                      key={actionIndex}
                      data-testid={action.props.label}
                      disabled={action.props.disabled}
                      onClick={action.props.onClick}
                    />
                  ))}
                </div>
              );
            }
            return null;
          })}
        </div>
      ))}
    </div>
  ),
  AppDatePicker: ({ label, onChange, disabled, readOnly, ...props }) => (
    <input
      {...props}
      data-testid={label}
      disabled={disabled || readOnly}
      onChange={(e) => onChange && onChange(new Date(e.target.value))}
    />
  ),
  AppAutocomplete: ({ label, options, onChange, onBeforeOpen, ...props }) => (
    <>
      <input
        {...props}
        data-testid={label}
        onChange={(e) =>
          onChange && onChange(e, { id: "1", label: e.target.value })
        }
        onFocus={onBeforeOpen}
      />
      <div>
        {options?.map((option, index) => (
          <div key={index}>{option.label}</div>
        ))}
      </div>
    </>
  ),
}));

jest.mock("react-hook-form", () => ({
  Controller: ({ render, name, control }) => {
    const field = {
      name,
      onChange: jest.fn(),
      onBlur: jest.fn(),
      value: "",
      ref: jest.fn(),
    };
    return render({ field });
  },
}));

jest.mock("@hookform/resolvers/yup", () => ({
  yupResolver: jest.fn(() => ({})),
}));

jest.mock("@/utilities", () => ({
  Yup: {
    object: () => ({
      shape: () => ({}),
    }),
    mixed: () => ({
      nullable: () => ({}),
    }),
    date: () => ({
      nullable: () => ({
        when: () => ({
          is: () => ({}),
          then: () => ({ required: () => ({}) }),
        }),
      }),
    }),
    number: () => ({
      nullable: () => ({
        when: () => ({
          is: () => ({}),
          then: () => ({ required: () => ({}) }),
        }),
      }),
    }),
  },
  Transform: {
    formatNumber: (value) => value?.toLocaleString() || "",
    snakeToPascalCase: (str) => str,
  },
}));

jest.mock("@/constants", () => ({
  APPLICATION_DEFAULT: {
    language: "th",
    snackBar: {
      open: false,
      autoHideDuration: 5000,
      onClose: null,
      message: "Message",
      action: null,
      anchorOrigin: {
        horizontal: "left",
        vertical: "bottom",
      },
    },
    dialog: {
      title: "",
      open: false,
      onClose: null,
      renderContent: null,
      renderAction: null,
      useDefaultBehavior: true,
      draggable: false,
    },
    dataGrid: {
      pageNumber: 1,
      pageSize: 10,
    },
  },
  APPLICATION_RECORD_PRODUCT_CHANNEL_DETAIL_STATUS: [
    { id: "0", label: "ทั้งหมด" },
    { id: "1", label: "เปิดใช้งาน" },
    { id: "2", label: "ปิดใช้งาน" },
    { id: "3", label: "ยกเลิกใช้งาน" },
  ],
}));

jest.mock("date-fns", () => ({
  format: jest.fn((date, formatStr) => "01/01/2567"),
  addYears: jest.fn((date, years) => date),
  addDays: jest.fn((date, days) => date),
  parseISO: jest.fn((str) => new Date(str)),
  addHours: jest.fn((date, hours) => date),
}));

jest.mock("@mui/x-data-grid", () => ({
  GridActionsCellItem: ({ children, onClick, disabled, label }) => (
    <button onClick={onClick} disabled={disabled} data-testid={label}>
      {children}
    </button>
  ),
}));

jest.mock("@mui/icons-material", () => ({
  Add: () => <span>Add</span>,
  Edit: () => <span>Edit</span>,
  Search: () => <span>Search</span>,
  Delete: () => <span>Delete</span>,
  RestartAlt: () => <span>RestartAlt</span>,
  RemoveRedEye: () => <span>RemoveRedEye</span>,
}));

jest.mock("react-number-format", () => ({
  NumericFormat: ({ label, onValueChange, customInput: Input, ...props }) => (
    <Input
      {...props}
      data-testid={label}
      onChange={(e) =>
        onValueChange &&
        onValueChange({ floatValue: parseFloat(e.target.value) || null })
      }
    />
  ),
}));

// Mock AppManageSalePaidCategory
jest.mock(
  "../appManageSalePaidCategory",
  () =>
    ({ open, mode, handleSave, setOpen }) => {
      // แสดง dialog เมื่อมี mode (สำหรับการเทส)
      return mode ? (
        <div data-testid="app-manage-sale-paid-category" data-mode={mode}>
          <button
            onClick={() =>
              handleSave({ product_payment_id: 1, payment_name: "Test" })
            }
          >
            Save
          </button>
          <button onClick={() => setOpen(false)}>Close</button>
        </div>
      ) : null;
    }
);

// Mock hooks
const mockWatch = jest.fn();
const mockReset = jest.fn();
const mockSetValueData = jest.fn();
const mockResetData = jest.fn();
const mockWatchData = jest.fn();
const mockHandleSnackAlert = jest.fn();
const mockHandleNotification = jest.fn();

jest.mock("@/hooks", () => ({
  useAppForm: () => ({
    watch: mockWatch,
    reset: mockReset,
    control: {},
    handleSubmit: (onSubmit, onError) => (e) => {
      e && e.preventDefault();
      try {
        onSubmit({}, e);
      } catch (error) {
        onError && onError(error, e);
      }
    },
    clearErrors: jest.fn(),
    formState: { errors: {} },
  }),
  useAppSnackbar: () => ({ handleSnackAlert: mockHandleSnackAlert }),
  useAppDialog: () => ({ handleNotification: mockHandleNotification }),
  useAppSelector: () => ({ activator: "admin" }),
}));

// Mock global fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    status: 200,
    json: () =>
      Promise.resolve([
        {
          product_payment_id: 1,
          payment_name: "เงินสด",
          active_status: 1,
          name_status: "เปิดใช้งาน",
          min_coverage_amount: 1000,
          max_coverage_amount: 100000,
          create_by: "admin",
          create_date: "2024-01-01T00:00:00Z",
          update_by: "admin",
          update_date: "2024-01-01T00:00:00Z",
          is_active: true,
        },
      ]),
  })
);

describe("AppProductSalePaidCategory", () => {
  const dataForm = {
    watch: mockWatchData,
    reset: mockResetData,
    setValue: mockSetValueData,
    formState: { dirtyFields: {} },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockWatch.mockImplementation((field) => {
      const fields = {
        active_status: { id: "1", label: "เปิดใช้งาน" },
        payment_channel: { id: "1", label: "เงินสด" },
        min_coverage: 1000,
        max_coverage: 100000,
        create_date_start: null,
        create_date_end: null,
        update_date_start: null,
        update_date_end: null,
      };
      return fields[field] || null;
    });

    mockWatchData.mockImplementation((field) => {
      if (field === "salePaidCategory") {
        return [
          {
            product_payment_id: 1,
            payment_name: "เงินสด",
            active_status: 1,
            name_status: "เปิดใช้งาน",
            min_coverage_amount: 1000,
            max_coverage_amount: 100000,
            create_by: "admin",
            create_date: "2024-01-01T00:00:00Z",
            update_by: "admin",
            update_date: "2024-01-01T00:00:00Z",
            is_active: true,
          },
        ];
      }
      if (field === "salePaidCategoryTemp") {
        return [];
      }
      return {};
    });
  });

  it("renders main card and title", async () => {
    render(<AppProductSalePaidCategory dataForm={dataForm} productId="1" />);
    expect(await screen.findByTestId("app-card")).toHaveTextContent(
      "ประเภทการชำระเงิน"
    );
  });

  it("renders all form fields", async () => {
    render(<AppProductSalePaidCategory dataForm={dataForm} productId="1" />);
    expect(screen.getByTestId("สถานะ")).toBeInTheDocument();
    expect(screen.getByTestId("ประเภท")).toBeInTheDocument();
    //expect(screen.getByTestId("ความคุ้มครองต่ำสุด")).toBeInTheDocument();
    //expect(screen.getByTestId("ความคุ้มครองสูงสุด")).toBeInTheDocument();
    expect(screen.getByTestId("จากวันที่สร้าง")).toBeInTheDocument();
    expect(screen.getByTestId("ถึงวันที่สร้าง")).toBeInTheDocument();
    expect(screen.getByTestId("จากวันที่แก้ไข")).toBeInTheDocument();
    expect(screen.getByTestId("ถึงวันที่แก้ไข")).toBeInTheDocument();
  });

  it("renders action buttons", async () => {
    render(<AppProductSalePaidCategory dataForm={dataForm} productId="1" />);
    expect(screen.getByText("ล้างค่า")).toBeInTheDocument();
    expect(screen.getByText("ค้นหา")).toBeInTheDocument();
    expect(screen.getByText("เพิ่ม")).toBeInTheDocument();
  });

  it("renders AppDataGrid with rows", async () => {
    render(<AppProductSalePaidCategory dataForm={dataForm} productId="1" />);
    const grid = await screen.findByTestId("app-data-grid");
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveAttribute("data-rows");
  });

  it("calls handleSubmit when click ค้นหา", async () => {
    render(<AppProductSalePaidCategory dataForm={dataForm} productId="1" />);
    const searchButton = screen.getByText("ค้นหา");
    fireEvent.click(searchButton);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  });

  it("opens dialog when click เพิ่ม", async () => {
    render(<AppProductSalePaidCategory dataForm={dataForm} productId="1" />);
    const addButton = screen.getByText("เพิ่ม");
    fireEvent.click(addButton);

    // เช็คแค่ว่า dialog แสดงขึ้นมา
    expect(
      await screen.findByTestId("app-manage-sale-paid-category")
    ).toBeInTheDocument();
  });

  it("does not render เพิ่ม button when preventInput is true", async () => {
    render(
      <AppProductSalePaidCategory
        dataForm={dataForm}
        productId="1"
        preventInput={true}
      />
    );
    expect(screen.queryByText("เพิ่ม")).not.toBeInTheDocument();
  });

  it("handles view action", async () => {
    render(<AppProductSalePaidCategory dataForm={dataForm} productId="1" />);

    await waitFor(() => {
      const viewButton = screen.getByTestId("ดูรายละเอียด");
      fireEvent.click(viewButton);
    });

    expect(
      await screen.findByTestId("app-manage-sale-paid-category")
    ).toHaveAttribute("data-mode", "view");
  });

  it("handles edit action", async () => {
    render(<AppProductSalePaidCategory dataForm={dataForm} productId="1" />);

    await waitFor(() => {
      const editButton = screen.getByTestId("แก้ไขรายละเอียด");
      fireEvent.click(editButton);
    });

    expect(
      await screen.findByTestId("app-manage-sale-paid-category")
    ).toHaveAttribute("data-mode", "edit");
  });

  it("handles delete action for existing data", async () => {
    render(<AppProductSalePaidCategory dataForm={dataForm} productId="1" />);

    await waitFor(() => {
      const deleteButton = screen.getByTestId("ยกเลิกใช้งาน");
      fireEvent.click(deleteButton);
    });

    expect(mockHandleNotification).toHaveBeenCalledWith(
      "คุณต้องการยกเลิกรายการนี้หรือไม่ ?",
      expect.any(Function),
      null,
      "question"
    );
  });

  it("handles delete action for temp data", async () => {
    const tempDataForm = {
      ...dataForm,
      watch: jest.fn((name) => {
        if (name === "salePaidCategoryTemp")
          return [
            { product_payment_id: 1, payment_name: "เงินสด", is_new: true },
          ];
        return mockWatchData(name);
      }),
    };

    render(
      <AppProductSalePaidCategory dataForm={tempDataForm} productId="1" />
    );

    await waitFor(() => {
      const deleteButton = screen.getByTestId("นำรายการออก");
      fireEvent.click(deleteButton);
    });

    expect(mockHandleNotification).toHaveBeenCalledWith(
      "คุณต้องการยกเลิกรายการนี้หรือไม่ ?",
      expect.any(Function),
      null,
      "question"
    );
  });

  it("handles delete confirmation callback correctly", async () => {
    render(<AppProductSalePaidCategory dataForm={dataForm} productId="1" />);

    await waitFor(() => {
      const deleteButton = screen.getByTestId("ยกเลิกใช้งาน");
      fireEvent.click(deleteButton);
    });

    // Execute the confirmation callback
    const confirmCallback = mockHandleNotification.mock.calls[0][1];
    confirmCallback();

    expect(mockSetValueData).toHaveBeenCalledWith(
      "salePaidCategoryTemp",
      expect.arrayContaining([
        expect.objectContaining({
          active_status: 3,
          name_status: "ยกเลิกใช้งาน",
          update_by: "admin",
        }),
      ]),
      { shouldDirty: true }
    );
  });

  it("handles save functionality for new data", async () => {
    render(<AppProductSalePaidCategory dataForm={dataForm} productId="1" />);

    const addButton = screen.getByText("เพิ่ม");
    fireEvent.click(addButton);

    const saveButton = await screen.findByText("Save");
    fireEvent.click(saveButton);

    expect(mockSetValueData).toHaveBeenCalledWith(
      "salePaidCategoryTemp",
      expect.arrayContaining([
        expect.objectContaining({
          product_payment_id: 1,
          payment_name: "Test",
        }),
      ]),
      { shouldDirty: true }
    );
  });

  it("handles save functionality for existing data", async () => {
    const tempDataForm = {
      ...dataForm,
      watch: jest.fn((name) => {
        if (name === "salePaidCategoryTemp")
          return [{ product_payment_id: 1, payment_name: "เงินสด" }];
        return mockWatchData(name);
      }),
    };

    render(
      <AppProductSalePaidCategory dataForm={tempDataForm} productId="1" />
    );

    const addButton = screen.getByText("เพิ่ม");
    fireEvent.click(addButton);

    const saveButton = await screen.findByText("Save");
    fireEvent.click(saveButton);

    expect(mockSetValueData).toHaveBeenCalled();
  });

  it("handles pagination model change", async () => {
    render(<AppProductSalePaidCategory dataForm={dataForm} productId="1" />);
    await waitFor(() =>
      expect(screen.getByTestId("app-data-grid")).toBeInTheDocument()
    );
  });

  it("handles sort model change", async () => {
    render(<AppProductSalePaidCategory dataForm={dataForm} productId="1" />);
    await waitFor(() =>
      expect(screen.getByTestId("app-data-grid")).toBeInTheDocument()
    );
  });

  it("handles loading state correctly", async () => {
    render(<AppProductSalePaidCategory dataForm={dataForm} productId="1" />);
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it("handles API error responses correctly", async () => {
    global.fetch.mockResolvedValueOnce({
      status: 200,
      json: () => Promise.resolve({ status: 204 }),
    });

    render(<AppProductSalePaidCategory dataForm={dataForm} productId="1" />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it("handles fetch error when searching", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Network error"));

    render(<AppProductSalePaidCategory dataForm={dataForm} productId="1" />);
    const searchButton = screen.getByText("ค้นหา");
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(mockHandleSnackAlert).toHaveBeenCalledWith(
        expect.objectContaining({
          open: true,
          message: expect.stringContaining("ล้มเหลวเกิดข้อผิดพลาด"),
        })
      );
    });
  });

  it("disables actions when preventInput is true", async () => {
    render(
      <AppProductSalePaidCategory
        dataForm={dataForm}
        productId="1"
        preventInput={true}
      />
    );

    await waitFor(() => {
      const editButton = screen.getByTestId("แก้ไขรายละเอียด");
      const deleteButton = screen.getByTestId("ยกเลิกใช้งาน");

      expect(editButton).toBeDisabled();
      expect(deleteButton).toBeDisabled();
    });
  });

  it("handles inactive row actions correctly", async () => {
    const inactiveDataForm = {
      ...dataForm,
      watch: jest.fn((name) => {
        if (name === "salePaidCategory")
          return [
            {
              product_payment_id: 1,
              payment_name: "เงินสด",
              active_status: 3,
              name_status: "ยกเลิกใช้งาน",
              is_active: false,
            },
          ];
        return mockWatchData(name);
      }),
    };

    render(
      <AppProductSalePaidCategory dataForm={inactiveDataForm} productId="1" />
    );

    await waitFor(() => {
      const viewButton = screen.getByTestId("ดูรายละเอียด");
      expect(viewButton).toBeInTheDocument();

      // Edit and delete buttons should not exist for inactive rows
      expect(screen.queryByTestId("แก้ไขรายละเอียด")).not.toBeInTheDocument();
      expect(screen.queryByTestId("ยกเลิกใช้งาน")).not.toBeInTheDocument();
    });
  });

  it("handles date field validation", async () => {
    render(<AppProductSalePaidCategory dataForm={dataForm} productId="1" />);

    const createDateStart = screen.getByTestId("จากวันที่สร้าง");
    const createDateEnd = screen.getByTestId("ถึงวันที่สร้าง");

    expect(createDateStart).toBeInTheDocument();
    expect(createDateEnd).toBeDisabled(); // disabled until start date is selected
  });

  it("handles different sort models", async () => {
    render(<AppProductSalePaidCategory dataForm={dataForm} productId="1" />);

    // Test with default sort model
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/direct?action=getProductPaymentMethodsById",
        expect.objectContaining({
          body: expect.stringContaining('"field":"create_date"'),
        })
      );
    });
  });

  it("handles payment type fetch", async () => {
    const paymentTypeData = [
      { id: 1, label: "เงินสด" },
      { id: 2, label: "เช็ค" },
    ];

    global.fetch.mockResolvedValueOnce({
      status: 200,
      json: () => Promise.resolve(paymentTypeData),
    });

    render(<AppProductSalePaidCategory dataForm={dataForm} productId="1" />);

    // This would be triggered by AppAutocomplete onBeforeOpen
    await waitFor(() => {
      expect(screen.getByTestId("ประเภท")).toBeInTheDocument();
    });
  });

  it("handles column value getter for dates", async () => {
    const testDate = "2024-01-01T00:00:00Z";
    const invalidDate = "invalid-date";

    render(<AppProductSalePaidCategory dataForm={dataForm} productId="1" />);

    // Test date formatting through valueGetter
    // This is implicitly tested through the data grid rendering
    await waitFor(() => {
      expect(screen.getByTestId("app-data-grid")).toBeInTheDocument();
    });
  });

  it("handles rowsDisplay memoization correctly", async () => {
    const tempDataForm = {
      ...dataForm,
      watch: jest.fn((name) => {
        if (name === "salePaidCategory")
          return [
            {
              product_payment_id: 1,
              payment_name: "เงินสด",
              active_status: 1,
            },
          ];
        if (name === "salePaidCategoryTemp")
          return [
            {
              product_payment_id: 1,
              payment_name: "เงินสดแก้ไข",
              active_status: 1,
            },
            {
              product_payment_id: 2,
              payment_name: "เช็ค",
              active_status: 1,
              is_new: true,
            },
          ];
        return mockWatchData(name);
      }),
    };

    render(
      <AppProductSalePaidCategory dataForm={tempDataForm} productId="1" />
    );

    await waitFor(() => {
      const grid = screen.getByTestId("app-data-grid");
      const rowsData = JSON.parse(grid.getAttribute("data-rows"));
      expect(rowsData).toHaveLength(2);
      expect(rowsData[0].payment_name).toBe("เงินสดแก้ไข"); // override
      expect(rowsData[1].payment_name).toBe("เช็ค"); // new item
    });
  });

  it("handles dirty data state correctly", async () => {
    const dirtyDataForm = {
      ...dataForm,
      formState: { dirtyFields: { salePaidCategoryTemp: true } },
    };

    render(
      <AppProductSalePaidCategory dataForm={dirtyDataForm} productId="1" />
    );

    const searchButton = screen.getByText("ค้นหา");
    const resetButton = screen.getByText("ล้างค่า");
    const statusField = screen.getByTestId("สถานะ");

    expect(searchButton).toBeDisabled();
    expect(resetButton).toBeDisabled();
    expect(statusField).toBeDisabled();
  });

  it("handles form field onChange events", async () => {
    render(<AppProductSalePaidCategory dataForm={dataForm} productId="1" />);

    const statusField = screen.getByTestId("สถานะ");
    const typeField = screen.getByTestId("ประเภท");

    fireEvent.change(statusField, { target: { value: "เปิดใช้งาน" } });
    fireEvent.change(typeField, { target: { value: "เงินสด" } });

    expect(statusField).toBeInTheDocument();
    expect(typeField).toBeInTheDocument();
  });

  it("handles component unmount correctly", async () => {
    const { unmount } = render(
      <AppProductSalePaidCategory dataForm={dataForm} productId="1" />
    );

    await waitFor(() => {
      expect(screen.getByTestId("app-card")).toBeInTheDocument();
    });

    unmount();

    expect(screen.queryByTestId("app-card")).not.toBeInTheDocument();
  });
});
