import { renderHook } from "@utilities/jest";
import { useAppFieldArray, useAppForm } from "@hooks";
import { Yup } from "@utilities";
import { yupResolver } from "@hookform/resolvers/yup";

describe("useAppFieldArray", () => {
  describe("Hook Render", () => {
    it("should render without crashing", async () => {
      // arrange
      const validationSchema = Yup.object().shape({
        mockArrayProps: Yup.array(),
      });
      const { result } = renderHook(
        () => {
          const formMethods = useAppForm({
            mode: "onBlur",
            reValidateMode: "onChange",
            resolver: yupResolver(validationSchema),
            defaultValues: {
              mockArrayProps: [
                {
                  id: 1,
                  name: "item-1",
                },
              ],
            },
          });

          return useAppFieldArray({
            control: formMethods.control,
            name: "mockArrayProps",
          });
        },
        { formMethods: true }
      );

      // assert
      expect(result.current.fields.length).toBe(1);
    });
  });
});
