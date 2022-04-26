import styled from "styled-components";
import colors from "../../config/colors";

export const CtaButton = styled.button`
  background: ${colors.orange};
  color: ${colors.darkgray};
  padding: 0.5em 1em;
  border-radius: 0.25em;
  font-weight: bold;
  margin: 4em 0;
  transition: 250ms box-shadow;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0);
  cursor: pointer;
  &:hover {
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.35);
  }
`;

export const CtaLink = styled.a`
  background: ${colors.orange};
  color: ${colors.darkgray};
  padding: 0.5em 1em;
  border-radius: 0.25em;
  font-weight: bold;
  margin: 4em 0;
  transition: 250ms box-shadow;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0);
  &:hover {
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.35);
  }
`;

export const QuietCtaLink = styled(CtaLink)`
  background: none;
  color: ${colors.skyblue};
  border: 1px solid ${colors.skyblue};
`;