import {
  render,
  createMatchMedia,
  screen,
  within,
  fireEvent,
} from "@utilities/jest";
import { AppDatePicker } from "@components";
import { addYears, format } from "date-fns";
import DatePickerActionBar from "../app-datepicker/datepickerActionbar";

describe("AppDatePicker Component", () => {
  let consoleErrorSpy = jest
    .spyOn(console, "error")
    .mockImplementation(() => {});

  describe("Render Component", () => {
    it("should render without crashing", async () => {
      // arrange
      const component = <AppDatePicker />;

      // act
      await render(component);

      // assert
      expect(component).toBeDefined();
      expect(consoleErrorSpy).toHaveBeenCalledTimes(4);
    });

    it("should render without crashing screen size = 1920", async () => {
      // arrange
      window.matchMedia = createMatchMedia(1920);
      const component = <AppDatePicker />;

      // act
      await render(component);

      // assert
      expect(component).toBeDefined();
      expect(consoleErrorSpy).toHaveBeenCalledTimes(4);
    });
  });

  describe("User Event", () => {
    it("should handle defaultOnChange event", async () => {
      // arrange
      window.matchMedia = createMatchMedia(1920);
      const dateProps = new Date(2024, 11, 13);
      const component = (
        <AppDatePicker data-testid="input_date" value={dateProps} />
      );

      // act
      await render(component);
      const dateNow = format(addYears(dateProps, 543), "dd/MM/yyyy");
      const dateInput = await screen.findByTestId("input_date");
      const dateInputElement = await within(dateInput).findByDisplayValue(
        dateNow
      );

      const dateInputNew = format(addYears(dateProps, 544), "dd/MM/yyyy");
      fireEvent.change(dateInputElement, {
        target: {
          value: dateInputNew,
        },
      });

      // assert
      expect(component).toBeDefined();
      expect(dateInputElement).toBeDefined();
      expect(dateInputElement.value).toBe(dateInputNew);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(4);
    });
  });

  describe("DatePickerActionBar Subcomponent", () => {
    describe("Render Component", () => {
      it("should render without props", async () => {
        // arrange
        const component = <DatePickerActionBar />;

        // act
        await render(component);

        // assert
        expect(component).toBeDefined();
      });
    });
  });
});
