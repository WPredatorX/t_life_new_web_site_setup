"use client";

import {
  Fade,
  Box,
  useScrollTrigger,
  Tooltip,
  Fab,
  useTheme,
} from "@mui/material";
import { KeyboardArrowUp } from "@mui/icons-material";
import { useAppScroll } from "@hooks";

const AppScrollTop = ({ window }) => {
  const theme = useTheme();
  const { handleScrollTo } = useAppScroll();

  const trigger = useScrollTrigger({
    // target: window ? window() : undefined,
    target: undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = () => {
    handleScrollTo();
  };

  return (
    <Fade in={trigger} data-testid="scroll-top">
      <Tooltip placement="left" title={"เลื่อนขั้นด้านบน"}>
        <Box
          data-testid="test-box"
          role="presentation"
          onClick={handleClick}
          sx={{
            position: "fixed",
            bottom: {
              xs: 35,
              sm: 100,
            },
            right: 10,
            zIndex: 4,
          }}
        >
          <Fab
            variant="circular"
            size="large"
            style={{
              backgroundColor: theme.palette.grey[500],
              boxShadow: "none",
            }}
          >
            <KeyboardArrowUp
              style={{
                color: theme.palette.common.white,
                fontSize: "2rem",
              }}
            />
          </Fab>
        </Box>
      </Tooltip>
    </Fade>
  );
};

export default AppScrollTop;
