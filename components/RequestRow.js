import React, {Component} from "react";
import {Button, Table } from 'semantic-ui-react';
import web3 from "../ethereum/web3";
import Campaign from '../ethereum/campaign';

class RequestRow extends Component {
    onApprove = async () => {
        const campaign = await Campaign(this.props.address);
        const accounts = await web3.eth.getAccounts()
        await campaign.methods.approveRequest(this.props.id).send({
            from: accounts[0]
        });

    }
    render(){
        const { Row, Cell } = Table;
        const {id, request, shareholdersCount} = this.props;
        return(
            <Row>
                <Cell>{id}</Cell>
                <Cell>{request.description}</Cell>
                <Cell>{web3.utils.fromWei(request.value,'ether')}</Cell>
                <Cell>{request.recipient}</Cell>
                <Cell>{request.votes}/{shareholdersCount}</Cell>
                <Cell>
                    <Button color="green" basic onClick={this.onApprove}>
                        Approve
                    </Button>
                </Cell>
            </Row>

        )
    }
}

export default RequestRow;