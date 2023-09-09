"use client";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
export default function Advertisement() {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          <span>来自 畅哥科技</span>
        </Typography>
        <Typography variant="h5" component="div">
          <span>公益之心，携手前行</span>
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          <span>一起为公益，携手创未来</span>
        </Typography>
        <Typography variant="body2">
          <span>
            在这个世界上，有那么多需要帮助的人，而公益事业，就是那道温暖的光，照亮他们的未来。我们每天都在享受着互联网带来的便利。然而，我们是否忽视了它还能为需要帮助的人们带来更多的可能性？
            <br />
            公益事业不仅仅是捐款捐物，更是我们的一份责任和一份爱心。通过互联网，我们可以轻松地传递爱和温暖，让更多人受益。同时，参与公益事业也是我们提升自我、实现价值的方式。
            <br />
            加入公益事业，让我们一起行动起来，为这个世界带来更多的正能量。无论是帮助一个贫困的孩子完成学业，还是为一位老人送去关爱，每一个微小的行动都能带来深远的影响。我们相信，通过你我携手努力，这个世界将变得更加美好。
            <br />
            现在就开始行动吧！加入公益事业，一起为这个世界贡献一份力量。让我们一起用互联网的力量，推动公益事业的发展。因为你的参与，世界将变得更加美好。
          </span>
        </Typography>
      </CardContent>
    </Card>
  );
}
