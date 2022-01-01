import { ReactComponent as DocsIcon } from "../../assets/icons/docs.svg";
import { ReactComponent as AlphaHomeIcon } from "../../assets/icons/hidhiHome.svg";
import { SvgIcon } from "@material-ui/core";

const externalUrls = [
  {
    title: "Docs",
    url: "https://docs.alphadao.financial",
    icon: <SvgIcon component={DocsIcon} />,
  },
  {
    title: "Alpha home",
    url: "https://alphadao.financial",
    icon: <SvgIcon color="primary" component={AlphaHomeIcon} />,
  },
];

export default externalUrls;
