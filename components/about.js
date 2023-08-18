"use client";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
export default function Advertisement() {
  return (
    <Card sx={{ minWidth: 275 }} style={{ marginTop: "15px" }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          <span>关于本系统</span>
        </Typography>
        <Typography variant="h5" component="div">
          <span>星阳音乐系统</span>
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          <span>一款由中学生自制的音乐欣赏系统</span>
        </Typography>
        <Typography variant="body2">
          <span>版本：1.0.0_202308181416</span>
          <br />
          <span>
            更新日志：
            <br />
            1.0.0_202308180126：全新发布；
            <br />
            1.0.0_202308181416：新增飙升榜单区
          </span>
          <br />
          <br />
          <span>开发者：小研同学</span>
          <br />
          <span>运营：内蒙古畅哥计算机科技工作室</span>
          <br />
          <span>本系统仅用作个人音乐欣赏、学习交流，不可用于商业用途。</span>
          <br />
          <span>©2020-2023 内蒙古畅哥计算机科技工作室 版权所有. </span>
          <br />
          <span>音乐版权归属音乐原版权方所有。</span>
          <br />
          <span>如有侵权，请联系public@singtech.top删除。</span>
        </Typography>
      </CardContent>
    </Card>
  );
}
