import { useEffect, useState, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { type Container, type ISourceOptions } from "@tsparticles/engine";
import { loadFull } from "tsparticles";

import { styled } from "@mui/system";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { CircularProgress } from "@mui/material";

import { COLORS } from "../../theme";
import { useThemeContext } from "../../theme/ThemeContextProvider";

const {
  WHITE_ACCENT,
  PURPLE_ACCENT,
  GREEN_ACCENT,
  TEAL_ACCENT,
  YELLOW_ACCENT,
  RED_ACCENT,
  BLUE_DARK,
  DEEP_SLATE,
} = COLORS;

const StyledParticles = styled(Particles)({
  position: "absolute",
  width: "100%",
  height: "100vh",
  left: 0,
  top: 0,
});

const ParticlesTS = () => {
  const [init, setInit] = useState(false);
  const theme = useTheme();
  const { isDarkMode } = useThemeContext();

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (_container?: Container): Promise<void> => {};

  const options: ISourceOptions = useMemo(
    () => ({
      fullScreen: false,
      background: {
        color: {
          value: isDarkMode
            ? theme.palette.customColors.deepSlate
            : theme.palette.common.white,
        },
      },
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: "push",
          },
        },
        modes: {
          push: {
            quantity: 4,
          },
          repulse: {
            distance: 200,
            duration: 0.4,
          },
        },
      },
      particles: {
        color: {
          value: [
            WHITE_ACCENT,
            PURPLE_ACCENT,
            GREEN_ACCENT,
            TEAL_ACCENT,
            YELLOW_ACCENT,
            RED_ACCENT,
          ],
        },
        links: {
          enable: true,
          opacity: 0.09,
          color: isDarkMode ? WHITE_ACCENT : DEEP_SLATE,
        },
        move: {
          enable: true,
          random: true,
          speed: 0.4,
        },
        number: {
          density: {
            enable: true,
          },
          value: 80,
        },
        opacity: {
          value: isDarkMode ? 0.3 : 0.7,
          anim: {
            enable: true,
            speed: 1,
            opacity_min: 0.5,
          },
        },
        shape: {
          type: "circle",
        },
        size: {
          random: true,
          value: 4,
        },
      },
      detectRetina: true,
    }),
    [theme]
  );

  if (init) {
    return (
      <StyledParticles
        id="tsparticles"
        particlesLoaded={particlesLoaded}
        options={options}
      />
    );
  }

  return (
    <Box
      height="100vh"
      width="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="absolute"
      sx={{ background: theme.palette.customColors.blueDark, top: 0 }}
    >
      <CircularProgress sx={{ color: theme.palette.customColors.tealAccent }} />
    </Box>
  );
};

export default ParticlesTS;
