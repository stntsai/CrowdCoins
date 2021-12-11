import React, {Component} from "react";
import Layout from "../../components/Layout";
import Campaign from '../../ethereum/campaign';

class CampaignShow extends Component{
    static async getInitialProps(props){
        const campaign = Campaign(props.query.address);
        
        const summary = await campaign.methods.getSummary().call();
        // console.log(summary)
        return {
            minimumContribution: summary[0],
            balance: summary[1],
            requestsCount: summary[2],
            shareholdersCount: summary[3],
            manager: summary[4]
        }
    }

    render(){
        return (
            <Layout>
                <h3>campaign show!</h3>
            </Layout>
        )
    }
}

export default CampaignShow;