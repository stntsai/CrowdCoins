const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());


const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach( async() =>{
    accounts = await web3.eth.getAccounts();
    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface)) //parse the json file to js object 
        .deploy({data: compiledFactory.bytecode})
        .send({ from: accounts[0], gas: '1000000'});

    await factory.methods.createCampaign('100').send({
        from : accounts[0],
        gas: '1000000'
    });

    [campaignAddress] = await factory.methods.getDeployedCampaigns().call(); //take the first from returned list and assign to campaignAddress
    campaign = await new web3.eth.Contract(JSON.parse(compiledCampaign.interface), campaignAddress);//use address to get the deployed campaign
});

describe('Campaigns',()=>{
    it('deploys a factory and a campaign',()=>{
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('call is the campaign manager', async ()=>{
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0],manager);
    })

    it('allows people to contribute and marks them as shareholders',async()=>{
        await campaign.methods.contribute().send({
            value:'200',
            from: accounts[1]
        });
        const isShareholder = await campaign.methods.shareholders(accounts[1]).call();
        assert(isShareholder);
    });

    it('requries min contribution', async()=>{
        try{
            await campaign.methods.contribute().send({
                value: '1',
                from: accounts[1]
            });
            assert(false);
        } catch(err) {
            assert(err)
        }
    });

    it('allows a manger to make a payment request', async()=>{
        await campaign.methods
            .createRequest('test request1', '100', accounts[1])
            .send({
                from: accounts[0],
                gas: '1000000'
            });
        const request = await campaign.methods.requests(0).call();
        assert.equal('test request1', request.description);
    });

    it('processes requests', async()=>{
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10','ether')
        })

        await campaign.methods
            .createRequest('A', web3.utils.toWei('5','ether'), accounts[1])
            .send({ from: accounts[0], gas: '1000000'});

        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        let balance = await web3.eth.getBalance(accounts[1]);
        
        balance = web3.utils.fromWei(balance,'ether');
        balance = parseFloat(balance);
        assert(balance > 104);
    });
});