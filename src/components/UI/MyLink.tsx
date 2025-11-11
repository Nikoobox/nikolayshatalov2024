import { FC, ReactElement } from "react";
import { Typography } from "@mui/material";

interface MyLinkProps {
  link: string;
  className?: string;
  label?: string;
  customLabel?: ReactElement;
}

const MyLink: FC<MyLinkProps> = ({ link, className, label, customLabel }) => {
  return (
    <a
      href={link}
      rel="noopener noreferrer"
      target="_blank"
      className={className}
    >
      {label && (
        <Typography variant="h2" color="common.white">
          {label}
        </Typography>
      )}

      {customLabel && customLabel}
    </a>
  );
};

export default MyLink;
