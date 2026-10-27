import { FC } from "react";

import { styled } from "@mui/material/styles";

import { pixelBorder } from "../UI";

// Real photo in a pixel window frame with a hard drop shadow.
const StyledFrame = styled("div")(({ theme }) => {
  const isDarkMode = theme.palette.mode === "dark";
  const frame = isDarkMode
    ? theme.palette.common.white
    : theme.palette.common.black;

  return {
    width: "260px",
    height: "260px",
    flexShrink: 0,
    boxShadow: `${pixelBorder(frame)}, 12px 12px 0 0 ${
      isDarkMode ? "rgba(0, 0, 0, 0.6)" : "rgba(34, 34, 34, 0.18)"
    }`,
    "& img": {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
    },
  };
});

interface Props {
  src: string;
  alt: string;
}

const ProfilePhoto: FC<Props> = ({ src, alt }) => (
  <StyledFrame>
    <img src={src} alt={alt} />
  </StyledFrame>
);

export default ProfilePhoto;
