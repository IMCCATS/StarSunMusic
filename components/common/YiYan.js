"use client";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { GetYiYan } from "./fetchapi";
import * as React from "react";

export default function YiYan() {
  const [YiYan, SetYiYan] = React.useState({});
  React.useEffect(() => {
    GetYiYan()
      .then((e) => {
        SetYiYan(e);
      })
      .catch((err) => {});
  }, []);
  return (
    <Card sx={{ minWidth: 275 }} style={{ marginTop: "15px" }}>
      <CardContent style={{ display: "flex", justifyContent: "center" }}>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          <span>
            ⌈ {YiYan.text} ⌋ —— {YiYan.from}
          </span>
        </Typography>
      </CardContent>
    </Card>
  );
}
