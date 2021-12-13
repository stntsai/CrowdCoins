import React,{Component} from "react";
import Layout from "../../../components/Layout";
import { Button } from 'semantic-ui-react';
import { Link } from '../../../routes';
import Campaign from '../../../ethereum/campaign';

class RequestIndex extends Component{

    static async getInitialProps(props){
        const { address } = await props.query;
        const campaign = Campaign(address);
        const requestCount = await campaign.methods.getRequestsCount().call();

        // use requestCount as the total number we need to do the interation on
        // methods.requests function to fetch the request object stored in the contract
        const requests = await Promise.all(
            Array(requestCount).fill().map((element, index) => {
                return campaign.methods.requests(index).call();
            })
        )
        return { address, requests };
    }

    render(){
        return (
            <Layout>
                <h3>Request</h3>
                <Link route={`/campaigns/${this.props.address}/requests/new`}>
                    <a>
                        <Button primary>Add Request</Button>
                    </a>
                </Link>
            </Layout>
        )
    }
}

export default RequestIndex;