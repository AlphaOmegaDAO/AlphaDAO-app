import { createTheme, responsiveFontSizes } from "@material-ui/core/styles";
import fonts from "./fonts";
import commonSettings, { handleBackdropFilter } from "./global.js";

// TODO: Break repeated use color values out into list of consts declared here
// then set the values in darkTheme using the global color variables

const colors = {
  gold: {
    500: "#FFBC45",
    600: "#F0A72C",
  },
  common: {
    white: "#FCFCFC",
    black: "",
  },
  dark: {
    700: "#344750",
    800: "#232E33",
    900: "#182328",
  },
};

const darkTheme = {
<<<<<<< Updated upstream
  color: colors.common.white,
  gold: colors.gold[500],
  gray: "#A3A3A3",
  textHighlightColor: colors.gold[500],
  backgroundColor: colors.dark[800],
  background: `
    radial-gradient(circle at 44% 35%, rgba(255, 109, 0, .25), rgba(255, 109, 0, 0) 27%),
    radial-gradient(circle at 75% 59%, rgba(0, 209, 197, .25), rgba(0, 209, 197, 0) 33%)
  `,
  paperBg: `${colors.dark[900]}40`,
  modalBg: "#24242699",
  popoverBg: colors.dark[900],
  menuBg: "#36384080",
  backdropBg: "rgba(54, 56, 64, 0.5)",
  largeTextColor: colors.gold[500],
  activeLinkColor: colors.gold[500],
  activeLinkSvgColor:
    "brightness(0) saturate(100%) invert(84%) sepia(49%) saturate(307%) hue-rotate(326deg) brightness(106%) contrast(92%)",
  primaryButtonColor: "#333333",
  primaryButtonBG: "#F4D092",
  primaryButtonHoverBG: "#EDD8B4",
  secondaryButtonHoverBG: "rgba(54, 56, 64, 1)",
  outlinedPrimaryButtonHoverBG: "#F8CC82",
  outlinedPrimaryButtonHoverColor: "#333333",
  outlinedSecondaryButtonHoverBG: "transparent",
  outlinedSecondaryButtonHoverColor: "#F8CC82", //gold
  containedSecondaryButtonBG: colors.dark[900],
  containedSecondaryButtonHoverBG: colors.dark[700],
=======
  color: "#FCFCFC",
  gold: "#d1d1d1",
  gray: "#A3A3A3",
  textHighlightColor: "#d1d1d1",
  backgroundColor: "#ffffff",

  background:`
   linear-gradient(180deg, rgba(8, 15, 53, 0), rgba(0, 0, 10, 0.9))
   `,
   background: `
     linear-gradient(280deg, rgba(0, 15, 53, 0), rgba(0, 0, 10, 0.9)),
     linear-gradient(333deg, rgba(153, 207, 255, 0.2), rgba(180, 255, 217, 0.08)),
     radial-gradient(circle at 77% 89%, rgba(125, 163, 169, 0.8), rgba(125, 163, 169, 0) 50%),
     radial-gradient(circle at 15% 95%, rgba(125, 163, 169, 0.8), rgba(125, 163, 169, 0) 43%),
     radial-gradient(circle at 65% 23%, rgba(137, 151, 119, 0.4), rgba(137, 151, 119, 0) 70%),
    radial-gradient(circle at 10% 0%, rgba(187, 211, 204, 0.33), rgba(187,211,204,0) 35%),
     radial-gradient(circle at 11% 100%, rgba(131, 165, 203, 0.3), rgba(131, 165, 203, 0) 30%)
     `,
  paperBg: "#282D37",
  modalBg: "#282D37",
  popoverBg: "rgba(54, 56, 64, 0.99)",
  menuBg: "#36384080",
  backdropBg: "rgba(54, 56, 64, 0.5)",
  largeTextColor: "#d1d1d1",
  activeLinkColor: "#F5DDB4",
  activeLinkSvgColor:
    "brightness(0) saturate(100%) invert(84%) sepia(49%) saturate(307%) hue-rotate(326deg) brightness(106%) contrast(92%)",
  primaryButtonColor: "#333333",
  primaryButtonBG: "#d1d1d1",
  primaryButtonHoverBG: "#EDD8B4",
  secondaryButtonHoverBG: "rgba(54, 56, 64, 1)",
  outlinedPrimaryButtonHoverBG: "#d1d1d1",
  outlinedPrimaryButtonHoverColor: "#333333",
  outlinedSecondaryButtonHoverBG: "transparent",
  outlinedSecondaryButtonHoverColor: "#d1d1d1", //gold
  containedSecondaryButtonHoverBG: "rgba(255, 255, 255, 0.15)",
>>>>>>> Stashed changes
  graphStrokeColor: "rgba(255, 255, 255, .1)",

  containedIconButton: colors.common.white,
  containedIconButtonHover: colors.gold[500],
};

export const dark = responsiveFontSizes(
  createTheme(
    {
      primary: {
        main: darkTheme.color,
      },
      palette: {
        type: "dark",
        background: {
          default: darkTheme.backgroundColor,
          paper: darkTheme.paperBg,
        },
        contrastText: darkTheme.color,
        primary: {
          main: darkTheme.color,
        },
        neutral: {
          main: darkTheme.color,
          secondary: darkTheme.gray,
        },
        text: {
          primary: darkTheme.color,
          secondary: darkTheme.gray,
        },
        graphStrokeColor: darkTheme.graphStrokeColor,
      },
      typography: {
        fontFamily: "CoHeadline",
      },
      props: {
        MuiSvgIcon: {
          htmlColor: darkTheme.color,
        },
      },
      overrides: {
        MuiCssBaseline: {
          "@global": {
            "@font-face": fonts,
            body: {
              background: darkTheme.background,
            },
          },
        },
        MuiAlert: {
          filledInfo: {
            backgroundColor: colors.gold[500],
            color: colors.dark[900],
          },
        },
        MuiDrawer: {
          paper: {
            backgroundColor: darkTheme.paperBg,
            zIndex: 7,
          },
        },
        MuiPaper: {
          root: {
            backgroundColor: darkTheme.paperBg,
            backdropFilter: "blur(200px)",
            background: `radial-gradient(circle at 28% 13%, rgba(255, 109, 0, .06), rgba(255, 109, 0, 0) 24%)`,
            "&.ohm-card": {
              background: "rgba(255, 255, 255, 0.05)",
              border: "0.5px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0px 20px 20px rgba(0, 0, 0, 0.05)",
              // backgroundColor: darkTheme.paperBg,
              backdropFilter: "blur(40px)",
            },
            "&.bond-card": {
              background: colors.dark[900],
              border: "0.5px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0px 20px 20px rgba(0, 0, 0, 0.05)",
              // backgroundColor: darkTheme.paperBg,
              // backdropFilter: "blur(40px)",
            },
            "&.ohm-modal": {
              background: colors.dark[900],
              // backgroundColor: darkTheme.modalBg,
            },
            "&.ohm-menu": {
              backgroundColor: darkTheme.menuBg,
              backdropFilter: "blur(33px)",
            },
            "&.ohm-popover": {
              backgroundColor: darkTheme.popoverBg,
              color: darkTheme.color,
              backdropFilter: "blur(15px)",
            },
          },
        },
        MuiBackdrop: {
          root: {
            backgroundColor: darkTheme.backdropBg,
          },
        },
        MuiLink: {
          root: {
            color: darkTheme.color,
            "& #non-active-bond-icon, & #non-active-stake-icon, & #doc-icon, & #dashboard-icon, & #settings-icon": {
              fill: "none",
              stroke: darkTheme.color,
            },
            "&:hover": {
              "&:hover #non-active-bond-icon, &:hover #non-active-stake-icon, &:hover #doc-icon, & #dashboard-icon, & #settings-icon":
                {
                  fill: "none",
                  stroke: darkTheme.textHighlightColor,
                },
              color: darkTheme.textHighlightColor,
              textDecoration: "none",
              "&.active": {
                color: darkTheme.activeLinkColor,
              },
            },
            "&.active": {
              color: darkTheme.activeLinkColor,
              textDecoration: "none",
              "& #dashboard-icon": {
                fill: darkTheme.textHighlightColor,
                stroke: darkTheme.textHighlightColor,
              },
              " & #stake-icon, & #bond-icon": {
                fill: darkTheme.textHighlightColor,
                stroke: "none",
              },
            },
          },
        },
        MuiTableCell: {
          root: {
            color: darkTheme.color,
          },
        },
        MuiInputBase: {
          root: {
            // color: darkTheme.gold,
          },
        },
        MuiOutlinedInput: {
          notchedOutline: {
            // borderColor: `${darkTheme.gold} !important`,
            "&:hover": {
              // borderColor: `${darkTheme.gold} !important`,
            },
          },
        },
        MuiTab: {
          textColorPrimary: {
            color: darkTheme.gray,
            "&$selected": {
              color: darkTheme.gold,
            },
          },
        },
        PrivateTabIndicator: {
          colorPrimary: {
            "&$selected": {
              color: darkTheme.gold,
            },
            backgroundColor: darkTheme.gold,
            // "&.active": {
            color: darkTheme.activeLinkColor,
            // },
          },
        },
        MuiToggleButton: {
          root: {
            backgroundColor: darkTheme.paperBg,
            "&:hover": {
              color: darkTheme.color,
              backgroundColor: `${darkTheme.containedSecondaryButtonHoverBG} !important`,
            },
            selected: {
              backgroundColor: darkTheme.containedSecondaryButtonHoverBG,
            },
            "@media (hover:none)": {
              "&:hover": {
                color: darkTheme.color,
                backgroundColor: darkTheme.paperBg,
              },
              "&:focus": {
                color: darkTheme.color,
                backgroundColor: darkTheme.paperBg,
                borderColor: "transparent",
                outline: "#00000000",
              },
            },
          },
        },
        MuiButton: {
          containedPrimary: {
            color: darkTheme.primaryButtonColor,
            backgroundColor: darkTheme.gold,
            "&:hover": {
              backgroundColor: darkTheme.primaryButtonHoverBG,
              color: darkTheme.primaryButtonHoverColor,
            },
            "&:active": {
              backgroundColor: darkTheme.primaryButtonHoverBG,
              color: darkTheme.primaryButtonHoverColor,
            },
            "@media (hover:none)": {
              color: darkTheme.primaryButtonColor,
              backgroundColor: darkTheme.gold,
              "&:hover": {
                backgroundColor: darkTheme.primaryButtonHoverBG,
              },
            },
          },
          containedSecondary: {
            border: "0.5px solid rgba(255, 255, 255, 0.2)",
            backgroundColor: darkTheme.containedSecondaryButtonBG,
            "&:disabled": {
              backgroundColor: darkTheme.containedSecondaryButtonBG,
              opacity: 0.5,
              color: darkTheme.color,
            },
            "&:hover": {
              backgroundColor: `${darkTheme.containedSecondaryButtonHoverBG} !important`,
            },
            "&:active": {
              backgroundColor: darkTheme.containedSecondaryButtonHoverBG,
            },
            "&:focus": {
              backgroundColor: darkTheme.paperBg,
            },
            "@media (hover:none)": {
              color: darkTheme.color,
              backgroundColor: darkTheme.paperBg,
              "&:hover": {
                backgroundColor: `${darkTheme.containedSecondaryButtonHoverBG} !important`,
              },
            },
          },
          outlinedPrimary: {
            backgroundColor: darkTheme.containedSecondaryButtonBG,
            border: "0.5px solid rgba(255, 255, 255, 0.2)",
            "&:hover": {
              color: darkTheme.outlinedPrimaryButtonHoverColor,
              backgroundColor: darkTheme.primaryButtonHoverBG,
            },
            "@media (hover:none)": {
              backgroundColor: darkTheme.containedSecondaryButtonBG,
              border: "0.5px solid rgba(255, 255, 255, 0.2)",
              "&:hover": {
                color: darkTheme.outlinedPrimaryButtonHoverColor,
                backgroundColor: `${darkTheme.primaryButtonHoverBG} !important`,
                textDecoration: "none !important",
              },
            },
          },
          outlinedSecondary: {
            color: darkTheme.color,
            borderColor: darkTheme.color,
            "&:hover": {
              color: darkTheme.outlinedSecondaryButtonHoverColor,
              backgroundColor: darkTheme.outlinedSecondaryButtonHoverBG,
              borderColor: darkTheme.gold,
            },
          },
          textPrimary: {
            color: "#A3A3A3",
            "&:hover": {
              color: darkTheme.gold,
              backgroundColor: "#00000000",
            },
            "&:active": {
              color: darkTheme.gold,
<<<<<<< Updated upstream
              borderBottom: "#F8CC82",
=======
              borderBottom: "#d1d1d1",
>>>>>>> Stashed changes
            },
          },
          textSecondary: {
            color: darkTheme.color,
            "&:hover": {
              color: darkTheme.textHighlightColor,
            },
          },
        },
        MuiIconButton: {
          root: {
            color: darkTheme.containedIconButton,
            "& #settings-icon": {
              fill: "none",
              stroke: darkTheme.containedIconButton,
            },
            "&:hover": {
              color: darkTheme.containedIconButtonHover,
            },
            "&:hover #settings-icon": {
              fill: "none",
              stroke: darkTheme.containedIconButtonHover,
            },
          },
        },
      },
    },
    commonSettings,
  ),
);
