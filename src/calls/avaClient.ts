import { Avalanche } from '@avalabs/avalanchejs';
import { EVMAPI } from '@avalabs/avalanchejs/dist/apis/evm';

const avalanche = new Avalanche(process.env.AVA_BASE_URL, 443, 'https');
const cChain : EVMAPI = avalanche.CChain();

export default cChain;
