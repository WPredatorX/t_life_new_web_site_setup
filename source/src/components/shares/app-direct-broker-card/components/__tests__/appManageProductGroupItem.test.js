import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import AppManageProductGroupItem from "../appManageProductGroupItem";

describe("AppManageProductGroupItem", () => {
  const mockHandleRemove = jest.fn();
  const mockItem = {
    title: "Test Product Group",
  };
  const mockIndex = 0;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders component correctly", () => {
    render(
      <AppManageProductGroupItem
        item={mockItem}
        index={mockIndex}
        handleRemove={mockHandleRemove}
      />
    );

    expect(screen.getByText("โหลดเอกสาจากรายการนี้")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test Product Group")).toBeInTheDocument();
    expect(screen.getByText("ลบออก")).toBeInTheDocument();
  });

  it("renders switch with default checked state", () => {
    render(
      <AppManageProductGroupItem
        item={mockItem}
        index={mockIndex}
        handleRemove={mockHandleRemove}
      />
    );

    const switchElement = screen.getByRole("checkbox");
    expect(switchElement).toBeChecked();
  });

  it("renders disabled text field with item title", () => {
    render(
      <AppManageProductGroupItem
        item={mockItem}
        index={mockIndex}
        handleRemove={mockHandleRemove}
      />
    );

    const textField = screen.getByDisplayValue("Test Product Group");
    expect(textField).toBeDisabled();
  });

  it("calls handleRemove when delete button is clicked", () => {
    render(
      <AppManageProductGroupItem
        item={mockItem}
        index={mockIndex}
        handleRemove={mockHandleRemove}
      />
    );

    const deleteButton = screen.getByText("ลบออก");
    fireEvent.click(deleteButton);

    expect(mockHandleRemove).toHaveBeenCalledWith(
      "คุณต้องการลบรายการนี้หรือไม่ ?",
      mockIndex
    );
  });

  it("renders empty value when item title is undefined", () => {
    const itemWithoutTitle = {};
    render(
      <AppManageProductGroupItem
        item={itemWithoutTitle}
        index={mockIndex}
        handleRemove={mockHandleRemove}
      />
    );

    const textField = screen.getByRole("textbox");
    expect(textField.value).toBe("");
  });
});
