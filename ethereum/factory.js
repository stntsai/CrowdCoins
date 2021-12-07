import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const contract = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0xb24FBB15245Cd3C9D914B5199feAc29D88Ca6623' //deployed address
);

export default contract;