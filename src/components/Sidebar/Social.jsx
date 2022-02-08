import { SvgIcon, Link } from "@material-ui/core";
import { ReactComponent as GitHub } from "../../assets/icons/github.svg";
import { ReactComponent as Medium } from "../../assets/icons/medium.svg";
import { ReactComponent as Twitter } from "../../assets/icons/twitter.svg";
import { ReactComponent as Discord } from "../../assets/icons/discord.svg";
import img1_1 from '../../assets/ohm/1-1.png';
import img1_2 from '../../assets/ohm/1-2.png';
import img1_3 from '../../assets/ohm/1-3.png';
import img1_4 from '../../assets/ohm/1-4.png';
import medium from '../../assets/ohm/med@2x.png';
import discord from '../../assets/ohm/discord.png';

export default function Social() {
  return (
    <div className="social-row " >
      <a href="https://twitter.com/AlphaOmegaDAO" target="_blank" className="bottomImgs" style={{marginLeft:5,marginRight:15}}><img src={img1_1} alt="" className="bottomImgs2" style={{width:30,height:30}}/></a>
      <a href="https://github.com/AlphaOmegaDAO" target="_blank" className="bottomImgs" style={{marginLeft:15,marginRight:15}}><img src={img1_2} alt="" className="bottomImgs2" style={{width:30,height:30}}/></a>
      <a href="https://discord.gg/TxkJYnFCmk" target="_blank" className="bottomImgs" style={{marginLeft:15,marginRight:15}}><img src={discord} alt="" className="bottomImgs2" style={{width:30,height:30}}/></a>
      <a href="https://telegram.me/collablandbot?start=VFBDI1RFTCNDT01NIy0xMDAxNjYwNTc5OTQ1" target="_blank" className="bottomImgs" style={{marginLeft:15,marginRight:15}}><img src={img1_4} alt="" className="bottomImgs2" style={{width:30,height:30}}/></a>
    </div>
  );
}
