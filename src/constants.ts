export const THE_GRAPH_URL = "http://localhost:8000/subgraphs/name/Factory";
export const EPOCH_INTERVAL = 9600;

// NOTE could get this from an outside source since it changes slightly over time
export const BLOCK_RATE_SECONDS = 3;

export const TOKEN_DECIMALS = 9;

export const POOL_GRAPH_URLS = {
  4: "https://api.thegraph.com/subgraphs/name/pooltogether/rinkeby-v3_4_3",
  1: "https://api.thegraph.com/subgraphs/name/pooltogether/pooltogether-v3_4_3",
};

interface IAddresses {
  [key: number]: { [key: string]: string };
}

export const addresses: IAddresses = {
  4: {
    DAI_ADDRESS: "0xB2180448f8945C8Cc8AE9809E67D6bd27d8B2f2C", // duplicate
    PID_ADDRESS: "0xC0b491daBf3709Ee5Eb79E603D73289Ca6060932",
    STAKING_ADDRESS: "0xC5d3318C0d74a72cD7C55bdf844e24516796BaB2",
    STAKING_HELPER_ADDRESS: "0xf73f23Bb0edCf4719b12ccEa8638355BF33604A1",
    OLD_STAKING_ADDRESS: "0xb640AA9082ad720c60102489b806E665d67DCE32",
    SPID_ADDRESS: "0x1Fecda1dE7b6951B248C0B62CaeBD5BAbedc2084",
    OLD_SPID_ADDRESS: "0x8Fc4167B0bdA22cb9890af2dB6cB1B818D6068AE",
    MIGRATE_ADDRESS: "0x3BA7C6346b93DA485e97ba55aec28E8eDd3e33E2",
    DISTRIBUTOR_ADDRESS: "0x0626D5aD2a230E05Fb94DF035Abbd97F2f839C3a",
    BONDINGCALC_ADDRESS: "0xaDBE4FA3c2fcf36412D618AfCfC519C869400CEB",
    CIRCULATING_SUPPLY_ADDRESS: "0x5b0AA7903FD2EaA16F1462879B71c3cE2cFfE868",
    TREASURY_ADDRESS: "0x0d722D813601E48b7DAcb2DF9bae282cFd98c6E7",
    REDEEM_HELPER_ADDRESS: "0xBd35d8b2FDc2b720842DB372f5E419d39B24781f",
    PT_TOKEN_ADDRESS: "0x0a2d026bacc573a8b5a2b049f956bdf8e5256cfd", // 33T token address, taken from `ticket` function on PRIZE_STRATEGY_ADDRESS
    PT_PRIZE_POOL_ADDRESS: "0xf9081132864ed5e4980CFae83bDB122d86619281", // NEW
    PT_PRIZE_STRATEGY_ADDRESS: "0x2Df17EA8D6B68Ec444c9a698315AfB36425dac8b", // NEW
  },
  56: {
    DAI_ADDRESS: "0xe9e7cea3dedca5984780bafc599bd69add087d56", // duplicate
    BNB_ADDRESS: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    PID_ADDRESS: "0xAC2f8fb059C96C481fAE3f4702Ca324664b79B26",
    STAKING_ADDRESS: "0x86ea26b438e3f724fd42540fc32f61E91B6908B1", // The new staking contract
    STAKING_HELPER_ADDRESS: "0xC757Af07008029AC17135E6D973B0684e95Da532", // Helper contract used for Staking only
    SPID_ADDRESS: "0x02aB0e44666285fB9C0C182fBbd3f16805108462",
    DISTRIBUTOR_ADDRESS: "0x14C822B3c596d6DAb4069EE93fa1DDe389B843d1",
    BONDINGCALC_ADDRESS: "0x855D0eb9CcAFB566dEeBc7089396c5f8af4937C2",
    TREASURY_ADDRESS: "0xc193c5802d0c962418239D610c2bc3dd0aBFb476",
    REDEEM_HELPER_ADDRESS: "0x1a92a5EC7CaF53DA545c785D0Ee1C4A17eEA19e1",
    IDO_ADDRESS:'0x3Ae07374d7C89f608906321444e8AFdED91aDA5E',
    BUSD_ADDRESS:'0xe9e7cea3dedca5984780bafc599bd69add087d56'
  },

  
  97: {
    //012922-final
    DAI_ADDRESS: "0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee", // duplicate
    BNB_ADDRESS: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    PID_ADDRESS: "0x8D68CE825689f6AE8D96fFd0A4D7934f7aF0cB33",
    STAKING_ADDRESS: "0xEb940562Fb41C5147A03f55782fE9eb1fd4aC8Ff", // The new staking contract
    STAKING_HELPER_ADDRESS: "0xD52ECf178762A0ACD3D995b67D3a2005609F9C56", // Helper contract used for Staking only
    SPID_ADDRESS: "0x57f20F492CBBE93F5537B1E942E6a377Ae333EDE",
    DISTRIBUTOR_ADDRESS: "0xb3bD6D5502fE0cDC1Cb4cDe9491762Ec6a20A448",
    BONDINGCALC_ADDRESS: "0xCc652113fa60Bfaa1801b274B67A4dd8B352b9FB",
    TREASURY_ADDRESS: "0x3179E5100234D042329FecFc4202a339392de172",
    REDEEM_HELPER_ADDRESS: "0x60b448Cf248e85305dd6C36f04D23c1e78Ee52D6",
    // IDO_ADDRESS:'0x3Ae07374d7C89f608906321444e8AFdED91aDA5E',
    BUSD_ADDRESS:'0xE5f34eD0833529972883f91f18fBa4c22A1990a7',
    USDT_ADDRESS: '0x428F8d3118df077954BA6419c4d8afbE3a5031Ad'

},
};

//013022
//OX: 0x8D68CE825689f6AE8D96fFd0A4D7934f7aF0cB33
//BUSD: 0xE5f34eD0833529972883f91f18fBa4c22A1990a7
//USDT: 0x428F8d3118df077954BA6419c4d8afbE3a5031Ad
//Treasury: 0x3179E5100234D042329FecFc4202a339392de172
//Calc: 0xCc652113fa60Bfaa1801b274B67A4dd8B352b9FB
//Staking: 0xEb940562Fb41C5147A03f55782fE9eb1fd4aC8Ff
//xOX: 0x57f20F492CBBE93F5537B1E942E6a377Ae333EDE
//Distributor 0xb3bD6D5502fE0cDC1Cb4cDe9491762Ec6a20A448
//Staking Warmup 0x4220a41D7A020AD71020ebB37DdE4BEE3F0Fc1E0
//Staking Helper 0xD52ECf178762A0ACD3D995b67D3a2005609F9C56
//RedeemHelper:0x60b448Cf248e85305dd6C36f04D23c1e78Ee52D6
//BUSD Bond: 0xD26A485a6f1E42e9BB3CE922fA3bfc2766dd604d
//USDT Bond: 0x8230ebDA372247c2c700968600d73Fa33D916C11
//LP:0x47eecd292bc39b7c3d9b203239ad55d29a289355


//goldev5
//OX: 0xEd9a63A01B610143bc55BB6448458382dcd38637
//DAI: 0x9D5B2A0082075c60e9eeb59354bc6dC6eEB00bd3
//Frax: 0xcA7537C94f0FbB85c27727675F0D02C5eC63bf3A
//Treasury: 0x380a4Bdb0C5e3c757AD76DF64463a03C735C4913
//Calc: 0xA0CD4fd5CD6d1Be9C8ed1dEEbde5F64926b5C6d7
//Staking: 0x7cC164245bec8bBf98936D0D285b5658926C5b01
//xOX: 0x4E637f602414ac91b720E234DD3CEFDC0805a837
//Distributor 0xA488ab5fcefAaa1A7B5C517152c2bc29151D5844
//Staking Warmup 0xa43131301C9EcA4e6D4da3afE15a28E4aF120110
//Staking Helper 0x174274FD64E8FF5C31E67684CE3f2587673079D1
//DAI Bond: 0x64D9DFeb382df5cF5a3105ebaC23b8BC2d2E5875
//Frax Bond: 0x1Eb9170bea4bf7ad69eBDc2F23C548Fb6fDA6236

//Final SHOT 
//OX: 0x72c4C6959ffa9cDBe6732e439EDDCD25B8E56047
//BUSD: 0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee
//USDT: 0x337610d27c682e347c9cd60bd4b3b107c9d34ddd
//Treasury: 0xAF8Fa4302bcae2b1338F96EDE2398EeADedFbA9c
//Calc: 0x8E01c2A3DD4dB33adb1F6467E872d30Cb1210B21
//Distributor 0x57196fa107360634e7a615243b8F56459722CFFc
//xOX: 0xaEac4694a016aB33BF8a9165F78EbE694357F406
//Staking: 0x85297283f9972E668D84ac8Ac4CE4c75b2e1C54c
//Staking Warmup 0x77570685be51FE7cFa715D7496CA4b89F0105b79
//Staking Helper 0xF91afd3B42E4Ce9d3C76e437D02689894DEC18aF
//BUSD Bond: 0xF168645B7c202E029cA33d853a9dea5020DCCA53
//USDT Bond: 0xD39BD969Fb0d9B9CF78eDe489A1911Fdd1c4aa90


//LETS GO !
//OX: 0xFc41e2fEefd47D5c45457b4145320EDC8f7855AD
//BUSD: 0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee
//USDT: 0x337610d27c682e347c9cd60bd4b3b107c9d34ddd
//Treasury: 0x738BCEfBB8C42fDa4E6E98105489b232aB87545B
//Calc: 0x7d17f8abD8B2895aD4fDe6DEA5599b38D8d68981
//Distributor 0x88e99C554bB7DE82c79fCBFFE7588b79A7F63cFF
//xOX: 0x8211F497Fd07C7b94a5D2A1Bc4307A6438bF6E2f
//Staking: 0x682baa7FcC5fa4efdA7758e959D8C6dABCE87443
//Staking Warmup 0x1cbBFd9d2135c203D3Ef59248AC9092261E397ba
//Staking Helper 0xf54e8dFe9D95391bC05A8597d99aC09D50E25C98
//BUSD Bond: 0x0C3CCEC846f59d73D0eE9a1962aEac4F5900d9f2
//USDT Bond: 0xF7D1F45bfcD1D058005f0131a8102857da4f7302

// version 0.8.11
//OX: 0x67CCbE3c7dFBE9C33eb7D7B5019f8a304bdb89eA
//BUSD: 0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee
//USDT: 0x337610d27c682e347c9cd60bd4b3b107c9d34ddd
//Treasury: 0xb73AC8B3D62d2141e7e85790DEd64252e09A2495
//Calc: 0xc6AaEfC5215300C1ACD3B7064065F001e83715F1
//Distributor: 0x26308cd96fa2E933B5859AaE70ff6F9FCD80DeDf
//xOX: 0xC50f171BEd2bb81c4a6c2FaEae24DDAa70F90085
//Staking: 0x7bF97F61624dC84162B051CdaefE6C63d4FDEaB5
//Staking Helper: 0xcCfc260Dd751f74BaBef242CFdA05443862e9a28
//Staking Warmup: 0x3ae7984920dd4eB2b2B56a671f431869495EFB46
//BUSD Bond: 0x867a1035224393DA25E0cE93124d8f9244bdDb66
//USDT Bond: 0x4422968AffBAa22D2B3c4889313ae8F97Cf6422A

//012922-final
//OX: 0xb67a34F60fa80cEaf0f54639798AB80676c22eB7
//BUSD: 0xE5f34eD0833529972883f91f18fBa4c22A1990a7
//USDT: 0x428F8d3118df077954BA6419c4d8afbE3a5031Ad
//Treasury: 0x45Cf4950f95dEF6194cF20d2ff2939701d3736BB
//Calc: 0x537b9eDc8b713BB2227FB570EfAD6895C1308053
//Staking: 0xB1FEC1081f9dD1A6594431091E1640B6Eaeb28B4
//xOX: 0xeB4c0E5b04a640B9a69127dD9f2683ff5C473203
//Distributor 0x1647bb978e135bb4D86741158E656a3746b80eAF
//Staking Warmup 0x5264448D74E84361d234a451ae9a6E1C898aecB3
//Staking Helper 0xeffF01791dD9A7FB00e061010b433F84a90a166B
//RedeemHelper:0x4C6fE46A7C816CbDb4cfc773916d9f0B90253e98
//BUSD Bond: 0x7311f0A4E0441F8E46bd6cC2A83bE08458FEc45f
//USDT Bond: 0xc15d418c6b86ffa4FFe03d2DF51cCc90C8fE67F7
//LP:0x0aad6f832af932613b11ce0224ab1023655a21db