// Core
import React from "react";
import { shallow } from "enzyme";

// Test component
import Spinner from "../";

export const result = shallow(<Spinner />);

describe("Компонент Sinner:", () => {
    test("должен отрендерить разметку, если значение пропса isSpinning — true", () => {
        result.setProps({
            isSpinning: true,
        });
        expect(result).toMatchSnapshot();
    });

    test("должен отрендерить null, если значение пропса isSpinning — false", () => {
        result.setProps({
            isSpinning: false,
        });
        expect(result).toMatchSnapshot();
    });
});
