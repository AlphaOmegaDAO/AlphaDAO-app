import { SvgIcon, Link } from "@material-ui/core";
import { ReactComponent as Telegram } from "../../assets/icons/telegram.svg";
import { ReactComponent as Medium } from "../../assets/icons/medium.svg";
import { ReactComponent as Twitter } from "../../assets/icons/twitter.svg";
import { ReactComponent as Discord } from "../../assets/icons/discord.svg";

export default function Social() {
  return (
    <div className="social-row">
      <Link href="https://medium.com/alphadao" target="_blank">
        <SvgIcon color="primary" component={Medium} />
      </Link>

      <Link href="https://twitter.com/AlphaDAO?s=20" target="_blank">
        <SvgIcon color="primary" component={Twitter} />
      </Link>

      <Link href="https://t.me/joinchat/XHA1pfhwCRA2OGMx" target="_blank">
        <SvgIcon color="primary" component={Telegram} />
      </Link>

      <Link href="https://discord.com/invite/AlphaDAO" target="_blank">
        <SvgIcon color="primary" component={Discord} />
      </Link>
    </div>
  );
}
