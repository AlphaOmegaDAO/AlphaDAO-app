/**
 * Access `process.env` in an environment helper
 * Usage: `EnvHelper.env`
 * - Other static methods can be added as needed per
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static
 */
export class EnvHelper {

  /**
   * @returns `process.env`
   */
   
  static env = process.env;
  static mumbaiTestnetURI = ``;
  static polygonURI = ``;
  static bscTestnetURI = ``;
  static whitespaceRegex = /\s+/;

  /**
   * Returns env contingent segment api key
   * @returns segment
   */
   
  static getSegmentKey() {
    return EnvHelper.env.REACT_APP_SEGMENT_API_KEY;
  }

  static isNotEmpty(envVariable: string) {
    if (envVariable.length > 10) {
      return true;
    } else {
      return false;
    }
  }


 /**
   * NOTE(appleseed): Moralis IDs are only used as Fallbacks & are not Mandatory
   * @returns {Array} Array of Moralis API Ids
   */
   
  static getMoralisIdList() {
    let MORALIS_ID_LIST: string[];

    // split the provided API keys on whitespace
    if (EnvHelper.env.REACT_APP_MORALIS_IDS && EnvHelper.isNotEmpty(EnvHelper.env.REACT_APP_MORALIS_IDS)) {
      MORALIS_ID_LIST = EnvHelper.env.REACT_APP_MORALIS_IDS.split(new RegExp(EnvHelper.whitespaceRegex));
    } else {
      MORALIS_ID_LIST = [];
    }

    // now add the uri path
    if (MORALIS_ID_LIST.length > 0) {
      MORALIS_ID_LIST = MORALIS_ID_LIST.map(moralisID => ``);
    } else {
      MORALIS_ID_LIST = [];
    }
    return MORALIS_ID_LIST;
  }

  /**
   * @returns {Array} Array of node url addresses or empty set
   * node url addresses can be whitespace-separated string of "https" addresses
   * - functionality for Websocket addresses has been deprecated due to issues with WalletConnect
   *     - WalletConnect Issue: https://github.com/WalletConnect/walletconnect-monorepo/issues/193
   */
   
  static getSelfHostedNode() {
    let URI_LIST: string[];
    if (EnvHelper.env.REACT_APP_SELF_HOSTED_NODE && EnvHelper.isNotEmpty(EnvHelper.env.REACT_APP_SELF_HOSTED_NODE)) {
      URI_LIST = EnvHelper.env.REACT_APP_SELF_HOSTED_NODE.split(new RegExp(EnvHelper.whitespaceRegex));
    } else {
      URI_LIST = [];
    }
    return URI_LIST;
  }

  /**
   * in development will always return the `ethers` community key url even if .env is blank
   * in prod if .env is blank API connections will fail
   * @returns array of API urls
   */
   
  static getAPIUris() {
    let ALL_URIs = EnvHelper.getSelfHostedNode();
    if (EnvHelper.env.NODE_ENV === "development" && ALL_URIs.length === 0) {
      // push in the common ethers key in development
      ALL_URIs.push("https://hkxjqt7bwz2j.usemoralis.com:2053/server");
    }
    if (ALL_URIs.length === 0) console.error("API keys must be set in the .env");
    return ALL_URIs;
  }

  static getFallbackURIs() {
    const ALL_URIs = [...EnvHelper.getMoralisIdList()];
    return ALL_URIs;
  }

  static getGeoapifyAPIKey() {
    var apiKey = EnvHelper.env.REACT_APP_GEOAPIFY_API_KEY;
    if (!apiKey) {
      console.warn("Missing REACT_APP_GEOAPIFY_API_KEY environment variable");
      return null;
    }

    return apiKey;
  }
}
