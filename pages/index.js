import React, {Component} from 'react';
import factory from '../ethereum/factory';


class CampaignIndex extends Component {
    async componentDidMount(){
         await factory.methods.getDeployedCampaigns().call();
    }

    render(){
        return <div>Campaigns Index!</div>;
    }
}

export default CampaignIndex;