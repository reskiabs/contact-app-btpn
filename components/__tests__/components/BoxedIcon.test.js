import React from "react";
import renderer from "react-test-renderer";

import BoxedIcon from "../../../components/BoxedIcon";

describe("BoxedIcon component test", () => {
  it("has 1 child", () => {
    const tree = renderer.create(<BoxedIcon />).toJSON();
    expect(tree.children.length).toBe(1);
  });
});
