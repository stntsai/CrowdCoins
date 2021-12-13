import React,{Component} from "react";
import Layout from "../../../components/Layout";
import { Button, Table } from 'semantic-ui-react';
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
        return { address, requests, requestCount };
    }

    render(){ 
        const {Header, Row, HeaderCell, Body } = Table;

        return (
            <Layout>
                
                <Link route={`/campaigns/${this.props.address}/requests/new`}>
                    <a>
                        <Button primary floated="right">Add Request</Button>
                    </a>
                </Link>
                <h3>Request</h3>
                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>Description</HeaderCell>
                            <HeaderCell>Amount</HeaderCell>
                            <HeaderCell>Recipient</HeaderCell>
                            <HeaderCell>Approval</HeaderCell>
                            <HeaderCell>Approve</HeaderCell>
                            <HeaderCell>Finalize</HeaderCell>
                        </Row>
                    </Header>
                </Table>
            </Layout>
        )
    }
}

export default RequestIndex;