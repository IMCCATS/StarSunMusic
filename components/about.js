"use client";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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
          <span>版本：1.0.0_202309092136</span>
          <br />
          <span>由 畅哥科技&trade; 运营。</span>
          <br />
          <span>音乐版权归其版权方所有。</span>
          <br />
          <span>
            免责声明：本网站内容来源于网络，仅提供检索服务。本网站不存储任何内容，也不承担任何责任。如果您需要使用本网站提供的检索服务，您应当自行负责获取相关内容的合法性和准确性。此外，本网站保留随时修改本声明的权利。如果您继续使用本网站，即表示您已经接受了本声明的所有修改。具体请在首页
            -《用户协议与隐私政策》查看。
          </span>
        </Typography>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
          >
            <Typography>
              <span>更新日志</span>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="p">
              <span>
                1.0.0_202308180126：全新发布；
                <br />
                1.0.0_202308181416：新增飙升榜单区；
                <br />
                1.0.0_202308181910：新增分页功能，缩小页面体积；
                <br />
                1.0.0_202308182341：新增歌单区；
                <br />
                1.0.0_202308192022：修复了部分Bug，新增歌曲时间显示，优化了歌曲播放逻辑；
                <br />
                1.0.0_202308192127：修复了部分Bug，应用安全性优化，优化了歌曲播放逻辑；
                <br />
                1.0.0_202308202259：修复无法显示数据、播放慢等问题，移除无效内容，优化逻辑，应用安全性优化；
                <br />
                1.0.0_202308221336：重写逻辑，修复无法显示数据、播放慢等问题，应用安全性优化；
                <br />
                1.0.0_202308230043：优化逻辑，新增起始页，应用合规化处理；
                <br />
                1.0.0_202308262042：新增音量修改板块；
                <br />
                1.0.0_202309022056：优化代码逻辑，新增完整歌词查看功能，进行部分歌曲修复；
                <br />
                1.0.0_202309022222：优化代码逻辑，新增多重线路，进行部分歌曲修复；
                <br />
                1.0.0_202309031343：修复了歌单区在移动端变形导致无法播放的Bug；
                <br />
                1.0.0_202309092136：应用合规化处理，优化了操作逻辑；
              </span>
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
          >
            <Typography>
              <span>版权信息</span>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="p">
              <span>开发者：小研同学</span>
              <br />
              <span>运营：内蒙古畅哥计算机科技工作室</span>
              <br />
              <span>
                &copy; 2020 - {new Date().getFullYear()}{" "}
                内蒙古畅哥计算机科技工作室 版权所有.
              </span>
              <br />
              <span>
                特别致谢（无先后顺序）：故梦API；Ushio API；保罗
                API以及其他为本工具提供技术支持的平台。
              </span>
              <br />
              <span>
                本系统仅用作个人音乐欣赏、学习交流，不可用于商业用途。
              </span>
              <br />
              <span>应用程序可能响应较慢或无响应，烦请耐心等待，多次尝试~</span>
              <br />
              <span>
                搜索时，若更改了搜索词但出现的仍是之前的内容，请等待一会重新搜索即可。
              </span>
              <br />
              <span>如有侵权，请联系public@singtech.top删除。</span>
            </Typography>
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
}
