import { FC, useState } from "react";
import { IoMdPhonePortrait, IoMdDesktop, IoMdLaptop } from "react-icons/io";
import { isMobile } from "react-device-detect";
import { HiOutlineExternalLink } from "react-icons/hi";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

import { Box, Typography, Button } from "@mui/material";
import { styled } from "@mui/system";
import { useTheme } from "@mui/material/styles";

import { ProjectProps } from "./ProjectProps";
import { COLORS } from "../../theme/";
import MyDialog from "../MyDialog";

const BORDER_COLORS = [
  COLORS.PURPLE_ACCENT,
  COLORS.GREEN_ACCENT,
  COLORS.TEAL_ACCENT,
  COLORS.YELLOW_ACCENT,
  COLORS.RED_ACCENT,
];

const getRandomColor = () =>
  BORDER_COLORS[Math.floor(Math.random() * BORDER_COLORS.length)];

const StyledBox = styled(Box)(({ theme }) => ({
  "& .project-image": {
    borderRadius: theme.spacing(2),
    height: "260px",
    width: "100%",
    objectFit: "cover",
    border: `1px solid ${theme.palette.customColors.greyLitest}`,
    objectPosition: "top",
  },
  "& .icon": {
    color: theme.palette.customColors.grey,
    height: theme.spacing(3),
    width: theme.spacing(3),
  },
  "& .tool": {
    margin: "2px 10px 8px 2px",
    padding: "5px 10px",
    borderRadius: theme.spacing(2),
    background: theme.palette.customColors.greyLitest,
  },
  "& .link": {
    textDecoration: "none",
  },
}));

const Project: FC<ProjectProps> = ({
  name,
  img,
  tools,
  info,
  address,
  repo,
  isResponsive,
  showLink,
  showRepo,
  overview,
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const { ref, inView } = useInView({
    threshold: 0.2,
  });
  const theme = useTheme();

  const handleOnMouseOver = () => {
    setIsHovered(true);
  };

  const handleOnMouseOut = () => {
    setIsHovered(false);
  };

  const handleOverviewClick = () => {
    setIsOpenModal(true);
  };

  const techTools = tools.map((tool) => (
    <Typography color="customColors.grey" className="tool" key={tool}>
      {tool}
    </Typography>
  ));

  return (
    <>
      <StyledBox
        sx={{
          width: {
            sm: "100%",
            md: "45%",
          },
        }}
      >
        <motion.div
          ref={ref}
          initial={{ y: 30, opacity: 0 }}
          animate={inView && { y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Box
            onMouseOver={handleOnMouseOver}
            onMouseOut={handleOnMouseOut}
            width="100%"
            height="260px"
            sx={{
              position: "relative",
              borderRadius: "16px",
            }}
          >
            <img className="project-image" src={img} alt="project" />
            <Box
              width="100%"
              height="260px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={4}
              sx={{
                backgroundColor: theme.palette.common.black,
                opacity: isHovered ? 0.9 : 0,
                position: "absolute",
                top: 0,
                borderRadius: theme.spacing(2),
                transition: "opacity 0.3s ease-out",
                border: `3px solid ${getRandomColor()}`,
              }}
            >
              {showLink && (
                <a
                  href={`${address}`}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="link"
                >
                  <Typography variant="h2" color="common.white">
                    Live Link
                  </Typography>
                </a>
              )}

              {showRepo && (
                <a
                  href={`${repo}`}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="link"
                >
                  <Typography variant="h2" color="common.white">
                    Repo
                  </Typography>
                </a>
              )}

              {overview && (
                <Button
                  className="overview-button"
                  onClick={handleOverviewClick}
                >
                  <Typography variant="h2" color="common.white">
                    Overview
                  </Typography>
                </Button>
              )}
            </Box>
          </Box>

          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            my={1}
          >
            <Typography variant="h2" color="common.black">
              {name}
            </Typography>

            <Box display="flex" gap={1.5}>
              {isResponsive && <IoMdPhonePortrait className="icon" />}
              <IoMdLaptop className="icon" />
              <IoMdDesktop className="icon" />
            </Box>
          </Box>
          <Typography variant="body1" color="common.black" my={1.5}>
            {info}
          </Typography>
          <Box display="flex" flexWrap="wrap">
            {techTools}
          </Box>

          {/* mobile view */}
          {isMobile && (
            <Box display="flex" gap={3} mt={1.5}>
              {showRepo && (
                <a href={repo} target="_blank" rel="noopener noreferrer">
                  <Box display="flex" alignItems="center">
                    <Typography mr={0.5}>Git Repo</Typography>
                    <HiOutlineExternalLink />
                  </Box>
                </a>
              )}

              {showLink && (
                <a href={address} target="_blank" rel="noopener noreferrer">
                  <Box display="flex" alignItems="center">
                    <Typography mr={0.5}>Live Link</Typography>
                    <HiOutlineExternalLink />
                  </Box>
                </a>
              )}
            </Box>
          )}
        </motion.div>
      </StyledBox>

      <MyDialog
        open={isOpenModal}
        onClose={setIsOpenModal}
        title="Overview"
        fullScreen={isMobile}
        maxWidth="lg"
        actions={
          <a href={repo} target="_blank" rel="noopener noreferrer">
            <Box display="flex" alignItems="center">
              <Typography>Visit Git Repo</Typography>
              <HiOutlineExternalLink style={{ marginLeft: "4px" }} />
            </Box>
          </a>
        }
      >
        <Box
          width="100%"
          height="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            img: {
              margin: "2px 0",
              height: "100%",
              border: `1px solid ${theme.palette.customColors.greyLitest}`,
            },
          }}
        >
          <img src={overview} alt="overview" />
        </Box>
      </MyDialog>
    </>
  );
};

export default Project;
