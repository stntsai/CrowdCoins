import React, {Component} from "react";
import {Button, Table, Message } from 'semantic-ui-react';
import web3 from "../ethereum/web3";
import Campaign from '../ethereum/campaign';

class RequestRow extends Component {

    state = {
        approveLoading: false,
        finalizeLoading: false,
        approveErr: '',
        finalizeErr: ''
    }
    
    onApprove = async () => {
        this.setState({approveLoading: true, approveErr:'', finalizeErr:''})
        try{
            const campaign = await Campaign(this.props.address);
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.approveRequest(this.props.id).send({
                from: accounts[0]
            });
        }catch (err){
            this.setState({approveErr:err.message})
        }
        this.setState({approveLoading: false})
    }

    onFinalize = async() =>{
        const campaign = Campaign(this.props.address);
        const accounts = await web3.eth.getAccounts();
        this.setState({finalizeLoading: true, approveErr:'', finalizeErr:''})
        try{
            await campaign.methods.finalizeRequest(this.props.id).send({
                from: accounts[0]
            });
        } catch(err){
            this.setState({finalizeErr: err.message});
        }
        this.setState({finalizeLoading: false})
    }

    render(){
        const { Row, Cell } = Table;
        const {id, request, shareholdersCount} = this.props;
        const readyToFinalize = request.votes > shareholdersCount/2;

        return(
            <Row disabled={request.complete} positive={readyToFinalize && !request.complete}>
                <Cell>{id}</Cell>
                <Cell>{request.description}</Cell>
                <Cell>{web3.utils.fromWei(request.value,'ether')}</Cell>
                <Cell>{request.recipient}</Cell>
                <Cell>{request.votes}/{shareholdersCount}</Cell>
                <Cell>
                    {request.complete? null: (
                        <Button color="green" basic onClick={this.onApprove} loading={this.state.approveLoading}>
                            Approve
                        </Button>
                    )}
                    { this.state.approveLoading?(
                        <div>Please wait for approval...</div>
                    ):(
                        <div>{this.state.approveErr}</div>
                    )}
                </Cell>
                <Cell>
                    {request.complete? null: (
                        <Button color="teal" basic onClick={this.onFinalize} loading={this.state.finalizeLoading}>
                            Finalize
                        </Button>
                    )}
                    { this.state.finalizeLoading?(
                        <div>Please wait for finalizing...</div>
                    ):(
                        <div>{this.state.finalizeErr}</div>
                    )}
                </Cell>
            </Row>
            

        )
    }
}

export default RequestRow;