import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const contract = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x56Ff3991400D4649bC06c4496Fd13834fd05f64b' //deployed address
);

export default contract;