import isPropValid from "@emotion/is-prop-valid";

export const transientProps = {
  shouldForwardProp: (prop: string) => !prop.startsWith("$") && isPropValid(prop),
};
