import React, {Component} from "react";
import { Card } from "semantic-ui-react";
import Layout from "../../components/Layout";
import Campaign from '../../ethereum/campaign';

class CampaignShow extends Component{
    static async getInitialProps(props){
        const campaign = Campaign(props.query.address);
        
        const summary = await campaign.methods.getSummary().call();

        return {
            minimumContribution: summary[0],
            balance: summary[1],
            requestsCount: summary[2],
            shareholdersCount: summary[3],
            manager: summary[4]
        }
    }

    renderCampaigns(){
        console.log(this.props)
        const {
            balance,
            manager,
            minimumContribution,
            requestsCount,
            shareholdersCount
        } = this.props;

        const items = [
            {
                header: manager,
                meta: 'Address of the Manager',
                description: 'The manager created this campaign and can create requests to withdraw money',
                style: {overflowWrap: 'break-word'}
            }
        ]

        return <Card.Group items={items}/>;
    }

    render(){
        return (
            <Layout>
                <h3>campaign show!</h3>
                {this.renderCampaigns()}
            </Layout>
        )
    }
}

export default CampaignShow;