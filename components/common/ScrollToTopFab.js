import React, { useState, useEffect } from "react";
import { Fab } from "@mui/material";
import NavigationIcon from "@mui/icons-material/Navigation";
import { useTheme } from "@mui/material/styles";

const ScrollToTopFab = () => {
  const [isFabVisible, setIsFabVisible] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight / 2) {
        setIsFabVisible(true);
      } else {
        setIsFabVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsFabVisible(false);
  };

  return (
    <Fab
      style={{
        position: "fixed",
        bottom: theme.spacing(2),
        right: theme.spacing(2),
        opacity: isFabVisible ? 1 : 0,
        transform: isFabVisible ? "scale(1)" : "scale(0)",
        transition: "ease-in-out", // 这里定义了所有的属性变化会在0.3秒内平滑过渡
        transitionDuration: "0.25s",
        transitionProperty: "all",
      }}
      variant="extended"
      onClick={handleClick}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <NavigationIcon sx={{ mr: 1 }} />
        <span>回到顶部</span>
      </div>
    </Fab>
  );
};

export default ScrollToTopFab;
