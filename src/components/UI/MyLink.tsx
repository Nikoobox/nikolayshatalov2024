import { FC, ReactElement } from "react";
import { Typography } from "@mui/material";

interface MyLinkProps {
  link: string;
  className?: string;
  label?: string;
  customLabel?: ReactElement;
  variant?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "body1"
    | "subtitleRegular"
    | "subtitleBold"
    | "labelBold"
    | "labelRegular";

  color?: string;
}

const MyLink: FC<MyLinkProps> = ({
  link,
  className,
  label,
  customLabel,
  variant,
  color,
}) => {
  return (
    <a
      href={link}
      rel="noopener noreferrer"
      target="_blank"
      className={className}
    >
      {label && (
        <Typography variant={variant || "h2"} color={color || "common.white"}>
          {label}
        </Typography>
      )}

      {customLabel && customLabel}
    </a>
  );
};

export default MyLink;
