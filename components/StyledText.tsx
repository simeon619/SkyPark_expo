import { Text, TextProps } from "./Themed";

export function TextThin(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: "Thin" }]} />;
}

export function TextThinItalic(props: TextProps) {
  return (
    <Text {...props} style={[props.style, { fontFamily: "ThinItalic" }]} />
  );
}

export function TextExtraLight(props: TextProps) {
  return (
    <Text {...props} style={[props.style, { fontFamily: "ExtraLight" }]} />
  );
}

export function TextExtraLightItalic(props: TextProps) {
  return (
    <Text
      {...props}
      style={[props.style, { fontFamily: "ExtraLightItalic" }]}
    />
  );
}

export function TextLight(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: "Light" }]} />;
}

export function TextLightItalic(props: TextProps) {
  return (
    <Text {...props} style={[props.style, { fontFamily: "LightItalic" }]} />
  );
}

export function TextRegular(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: "Regular" }]} />;
}

export function TextRegularItalic(props: TextProps) {
  return (
    <Text {...props} style={[props.style, { fontFamily: "RegularItalic" }]} />
  );
}

export function TextMedium(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: "Medium" }]} />;
}

export function TextMediumItalic(props: TextProps) {
  return (
    <Text {...props} style={[props.style, { fontFamily: "MediumItalic" }]} />
  );
}

export function TextSemiBold(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: "SemiBold" }]} />;
}

export function TextSemiBoldItalic(props: TextProps) {
  return (
    <Text {...props} style={[props.style, { fontFamily: "SemiBoldItalic" }]} />
  );
}

export function TextBold(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: "Bold" }]} />;
}

export function TextBoldItalic(props: TextProps) {
  return (
    <Text {...props} style={[props.style, { fontFamily: "BoldItalic" }]} />
  );
}

export function TextExtraBold(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: "ExtraBold" }]} />;
}

export function TextExtraBoldItalic(props: TextProps) {
  return (
    <Text {...props} style={[props.style, { fontFamily: "ExtraBoldItalic" }]} />
  );
}

export function TextBlack(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: "Black" }]} />;
}

export function TextBlackItalic(props: TextProps) {
  return (
    <Text {...props} style={[props.style, { fontFamily: "BlackItalic" }]} />
  );
}
