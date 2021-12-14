import React,{Component} from "react";
import Layout from "../../../components/Layout";
import { Button, Table, Message } from 'semantic-ui-react';
import { Link } from '../../../routes';
import Campaign from '../../../ethereum/campaign';
import RequestRow from "../../../components/RequestRow";

class RequestIndex extends Component{
    state={
        errorMessage:''
    }

    static async getInitialProps(props){
        const { address } = await props.query;
        const campaign = Campaign(address);
        const requestCount = await campaign.methods.getRequestsCount().call();
        const shareholdersCount = await campaign.methods.shareholdersCount().call();

        // use requestCount as the total number we need to do the interation on
        // methods.requests function to fetch the request object stored in the contract
        const requests = await Promise.all(
            Array(parseInt(requestCount)).fill().map((element, index) => {
                return campaign.methods.requests(index).call();
            })
        )
        return { address, requests, requestCount, shareholdersCount };
    }

    renderRow() {
        return this.props.requests.map((request, index) =>{
            return (
                <RequestRow 
                    key={index}
                    id={index}
                    request={request}
                    address={this.props.address}
                    shareholdersCount={this.props.shareholdersCount}
                />
            )
        })
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
                            <HeaderCell>Amount (eth)</HeaderCell>
                            <HeaderCell>Recipient</HeaderCell>
                            <HeaderCell>Approval</HeaderCell>
                            <HeaderCell>Approve</HeaderCell>
                            <HeaderCell>Finalize</HeaderCell>
                        </Row>
                    </Header>
                    <Body>{this.renderRow()}</Body>
                </Table>
                
                <div> Found {this.props.requestCount} requests.</div>
                <Link route={`/campaigns/${this.props.address}`}>
                    <a floated="right">Go Back</a>
                </Link>
                
            </Layout>
        )
    }
}

export default RequestIndex;