import { FC } from "react";
import { Typography } from "@mui/material";

interface MyLinkProps {
  link: string;
  className: string;
  label: string;
}

const MyLink: FC<MyLinkProps> = ({ link, className, label }) => {
  return (
    <a
      href={`${link}`}
      rel="noopener noreferrer"
      target="_blank"
      className={className}
    >
      <Typography variant="h2" color="common.white">
        {label}
      </Typography>
    </a>
  );
};

export default MyLink;
