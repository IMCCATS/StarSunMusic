"use client";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { appupdatecontent, appversion } from "@/app/api/appconfig";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Col, Row, QRCode, Statistic } from "antd";
import CountUp from "react-countup";
import dayjs from "dayjs";

const calculateDays = (dateString) => {
  const today = dayjs(); // 获取当前日期时间
  const targetDate = dayjs(dateString, { format: "YYYY-MM-DD" }); // 你的目标日期
  return (today - targetDate) / (1000 * 60 * 60 * 24); // 计算相差的天数
};
const formatter = (value) => <CountUp end={value} separator="," />;
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
          <span>“音韵流传，乐章永恒”</span>
        </Typography>
        <Typography variant="body2">
          <span>版本：{appversion}</span>
          <br />
          <span>由 畅哥科技&trade; 运营。</span>
          <br />
          <Tooltip
            placement="right"
            title="点击将前往外部查询网站：IP查询(ipw.cn)。联网备案号：粤公网安备 44030602005948号 | 联网ICP备案号：赣ICP备19001536号"
          >
            <a
              onClick={() => {
                window.open(
                  "https://ipw.cn/ipv6webcheck/?site=music.lcahy.cn",
                  "mozillaTab",
                  "noopener,noreferrer"
                );
              }}
            >
              <img
                style={{ display: "inline-block", verticalAlign: "middle" }}
                src="/IPv6.svg"
              />
            </a>
          </Tooltip>
          <br />
          <span>音乐版权归其版权方所有。</span>
          <br />
          <span>
            特别致谢（无先后顺序）：本系统所有的音乐的版权方及其提供平台；故梦API；Ushio
            API；保罗 API以及其他为本工具提供技术支持的平台。
          </span>
          <br />
          <span>
            免责声明：本网站内容来源于网络，仅提供检索服务，用于个人音乐欣赏。本网站不存储任何内容，也不承担任何责任。如果您需要使用本网站提供的检索服务，您应当自行负责获取相关内容的合法性和准确性。此外，本网站保留随时修改本声明的权利。如果您继续使用本网站，即表示您已经接受了本声明的所有修改。具体请在首页
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
            <Typography variant="p" style={{ fontSize: "14px" }}>
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
                <br />
                1.0.0_202309241529：支持热歌榜列表播放，修复了一些已知问题；
                <br />
                1.0.0_202309282129：新增个人歌单功能，修复了一些已知问题；
                <br />
                1.0.0_202309291438：支持歌单分享，适配系统暂停事件，修复了一些已知问题；
                <br />
                1.0.0_202309301020：支持部分歌曲查看翻译歌词，修复了一些已知问题；
                <br />
                1.0.0_202310020850：修复了播放器单曲循环与列表播放逻辑错误导致卡顿的问题，
                修复了一些已知问题；
                <br />
                1.0.0_202310021218：搜索歌曲支持加载更多，修复了一些已知问题；
                <br />
                1.0.0_202311051500：修复了一些已知问题；
                <br />
                {appversion}：{appupdatecontent}
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
            <Typography variant="p" style={{ fontSize: "14px" }}>
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
                本系统仅用作个人音乐欣赏、学习交流，不可用于商业用途。
              </span>
              <br />
              <span>应用程序可能响应较慢或无响应，烦请耐心等待，多次尝试~</span>
              <br />
              <span>如有侵权，请联系public@singtech.top删除。</span>
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
          >
            <Typography>
              <span>账户相关问题</span>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="p" style={{ fontSize: "14px" }}>
              <span>您的所有信息均在本地进行处理。</span>
              <br />
              <span>
                如您想注销账户，直接清除浏览器数据即可，本系统的一切数据将会清空。
              </span>
              <br />
              <span>
                如您想删除您之前分享过的歌单，请联系public@singtech.top删除。
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
              <span>手机扫码访问</span>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="p" style={{ fontSize: "14px" }}>
              <span>使用手机扫描下面的二维码进入星阳音乐系统~</span>
              <QRCode
                errorLevel="H"
                value="https://music.lcahy.cn/"
                icon="/logo.png"
              />
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
          >
            <Typography>
              <span>网站数据统计</span>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="p" style={{ fontSize: "14px" }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="项目启动时长（天）"
                    value={calculateDays("2023-08-17")}
                    formatter={formatter}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="运行时长（天）"
                    value={calculateDays("2023-08-18")}
                    formatter={formatter}
                  />
                </Col>
              </Row>
            </Typography>
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
}
