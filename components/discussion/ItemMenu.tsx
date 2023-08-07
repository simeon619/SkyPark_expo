import React, { memo } from "react";
import { horizontalScale, moderateScale } from "../../Utilis/metrics";
import { TextExtraLight } from "../StyledText";

const ItemMenu = memo(({ value }: { value: string }) => {
  return (
    <TextExtraLight
      style={{
        fontSize: moderateScale(17),
        paddingLeft: horizontalScale(10),
        textAlign: "left",
      }}
    >
      {value}
    </TextExtraLight>
  );
});

export default ItemMenu;
