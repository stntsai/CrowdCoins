import React, {Component} from "react";
import { Card, Grid, Button } from "semantic-ui-react";
import Layout from "../../components/Layout";
import Campaign from '../../ethereum/campaign';
import web3 from "../../ethereum/web3";
import ContributionForm from "../../components/ContibuteForm";
import { Link } from '../../routes';

class CampaignShow extends Component{
    static async getInitialProps(props){
        const campaignAddress = props.query.address;
        const campaign = Campaign(campaignAddress);
        const summary = await campaign.methods.getSummary().call();

        return {
            address: campaignAddress,
            minimumContribution: summary[0],
            balance: summary[1],
            requestsCount: summary[2],
            shareholdersCount: summary[3],
            manager: summary[4]
        }
    }

    renderCampaigns(){
        
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
                description: 'The manager created this campaign and can create requests to withdraw money.',
                style: {overflowWrap: 'break-word'}
            },
            {
                header: minimumContribution,
                meta: 'Minimum Contribution (wei)',
                description: 'You must contribute at least this much wei to become a shareholder.',
                style: {overflowWrap: 'break-word'}
            },
            {
                header: requestsCount,
                meta: 'Number of Requests',
                description: 'A request tries to withdraw money from the contract. Requests must be apprroved by at least half of the shareholders.',
                style: {overflowWrap: 'break-word'}
            },
            {
                header: shareholdersCount,
                meta: 'Number of Shareholders',
                description: 'Number of peple who have already paid the minimum contribution and became shareholder.',
                style: {overflowWrap: 'break-word'}
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: 'Campaign Balance(ether)',
                description: 'How much money this campaign has left to spend.',
                style: {overflowWrap: 'break-word'}
            },
        ]

        return <Card.Group items={items}/>;
    }

    render(){
        return (
            <Layout>
                <h3>Campaign Details</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            {this.renderCampaigns()}
                        </Grid.Column>

                        <Grid.Column width={6}>
                            <ContributionForm address={this.props.address}/>
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column>
                            <Link route={`/campaigns/${this.props.address}/requests`}>
                                <a>
                                    <Button primary> View Requests </Button>
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        )
    }
}

export default CampaignShow;