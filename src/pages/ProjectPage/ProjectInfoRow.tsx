// ProjectInfoRow.tsx
import { Box, Typography } from "@mui/material";

interface ProjectInfoRowProps {
  label: string;
  value: React.ReactNode;
  labelSx?: object;
  minWidth?: string | number;
}

const ProjectInfoRow = ({
  label,
  value,
  labelSx,
  minWidth = 140,
}: ProjectInfoRowProps) => (
  <Box
    display="flex"
    gap={{ xs: 1, sm: 2 }}
    sx={{ flexDirection: { xs: "column", sm: "row" } }}
  >
    <Box minWidth={minWidth}>
      <Typography variant="h3" sx={labelSx}>
        {label}
      </Typography>
    </Box>
    <Typography variant="h3">{value}</Typography>
  </Box>
);

export default ProjectInfoRow;
