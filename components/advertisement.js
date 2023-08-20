"use client";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "next/link";
export default function Advertisement() {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          <span>来自 畅哥科技</span>
        </Typography>
        <Typography variant="h5" component="div">
          <span>星阳学习系统</span>
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          <span>一款由中学生自制的辅助学习工具</span>
        </Typography>
        <Typography variant="body2">
          <span>
            开发者：小研同学 <br />
            运营：内蒙古畅哥计算机科技工作室 <br />
            版本：1.2.0
          </span>
        </Typography>
      </CardContent>
      <CardActions>
        <Link href="https://appstudy.lcahy.cn">
          <Button size="small">
            <span>前往了解</span>
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
}
