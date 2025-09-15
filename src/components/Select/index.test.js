import { fireEvent, render, screen } from "@testing-library/react";
import Select from "./index";

const mockSelection = [
  { value: "value1", label: "value1" },
  { value: "value2", label: "value2" },
];

describe("When a select is created", () => {
  it("a list of choices is displayed", () => {
    render(<Select selection={mockSelection} />);
    const selectElement = screen.getByTestId("select-testid");
    const selectDefault = screen.getByText("Toutes");
    expect(selectElement).toBeInTheDocument();
    expect(selectDefault).toBeInTheDocument();
  });
  it("a collapse action button is displayed", () => {
    render(<Select selection={mockSelection} />);
    const collapseButtonElement = screen.getByTestId("collapse-button-testid");
    expect(collapseButtonElement).toBeInTheDocument();
  });

  describe("with a label", () => {
    it("a label is displayed", () => {
      render(<Select label="label" selection={mockSelection} />);
      const labelDefault = screen.getByText("label");
      expect(labelDefault).toBeInTheDocument();
    });
  });

  describe("and a click is trigger on collapse button", () => {
    it("a list of values is displayed", () => {
      render(<Select selection={mockSelection} />);
      const collapseButtonElement = screen.getByTestId(
        "collapse-button-testid"
      );
      fireEvent.click(collapseButtonElement);

      const choice1 = screen.getByText(/value1/);
      const choice2 = screen.getByText(/value2/);
      expect(choice1).toBeInTheDocument();
      expect(choice2).toBeInTheDocument();
    });
    describe("and a click is triggered on a choice item", () => {
      it("a onChange callback is called", () => {
        const onChange = jest.fn();
        render(<Select selection={mockSelection} onChange={onChange} />);

        const collapseButtonElement = screen.getByTestId(
          "collapse-button-testid"
        );
        fireEvent.click(collapseButtonElement);
        // Click on value1
        const choice1 = screen.getByText("value1");
        fireEvent.click(choice1);
        expect(onChange).toHaveBeenCalledWith({
          value: "value1",
          label: "value1",
        });
        expect(onChange).toHaveBeenCalledTimes(1);
        // Click on Toutes
        fireEvent.click(collapseButtonElement);
        const choiceAll = screen.getByText("Toutes");
        fireEvent.click(choiceAll);
        expect(onChange).toHaveBeenCalledWith(null);
        // Ensure called twice total
        expect(onChange).toHaveBeenCalledTimes(2);
      });
    });
  });
});
