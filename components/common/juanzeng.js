"use client";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
export default function JuanZeng() {
  return (
    <Card sx={{ minWidth: 275 }} style={{ marginTop: "15px" }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          <span>支持本系统</span>
        </Typography>
        <Typography variant="h5" component="div">
          <span>星阳音乐系统</span>
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          <span>一款由中学生自制的音乐欣赏系统</span>
        </Typography>
        <Typography variant="body2">
          <span>
            感谢您对本系统的关注和使用，我们非常高兴能为您提供服务。
            <br />
            本系统无需您付费即可使用，且我们保证永不收费。
            <br />
            如果想支持本系统的话，那就始终保持积极向上的态度吧！勇往直前。无论是在学习、工作还是生活中，我们都会遇到各种困难和挑战。只有通过坚定的决心和不懈的努力，才能克服困难，实现目标。让我们一起为更美好的未来而努力奋斗，为未来创造更多的机会！
            <br />
            而且，在这个世界上，有那么多需要帮助的人，而公益事业，就是那道温暖的光，照亮他们的未来。对公益事业的支持，就是对我们的支持。参与公益事业，一起为这个世界贡献一份力量。让我们一起用互联网的力量，推动公益事业的发展。因为您的参与，世界将变得更加美好。
          </span>
        </Typography>
      </CardContent>
    </Card>
  );
}
