import { getMonth } from "./index";

describe("Date helper", () => {
  describe("When getMonth is called", () => {
    it("the function return janvier for 2022-01-01 as date", () => {
      expect(getMonth(new Date("2022-01-01"))).toBe("janvier");
    });
    it("the function return juillet for 2022-07-08 as date", () => {
      expect(getMonth(new Date("2022-07-08"))).toBe("juillet");
    });
    it("the function return décembre for 2022-12-25 as date", () => {
      expect(getMonth(new Date("2022-12-25"))).toBe("décembre");
    });

    it("the function return février for 2022-02-14 as date", () => {
      expect(getMonth(new Date("2022-02-14"))).toBe("février");
    });
  });
});
