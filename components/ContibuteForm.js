import React, {Component} from "react";
import {Form, Message, Input, Button} from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from "../ethereum/web3";
import { Router } from '../routes';


class ContributionForm extends Component{
    state ={
        loading: false,
        value: '',
        errorMessage: '',
        instructionWhileWait: ''
    }

    onSubmit = async (event) => {
        event.preventDefault();

        const campaign = Campaign(this.props.address)

        this.setState({ loading: true, errorMessage:'', instructionWhileWait:'Please wait for your registration (up to 30 secs)...'})
        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(this.state.value,'ether')
            });

            Router.replaceRoute(`/campaigns/${this.props.address}`)
        } catch(err){
            this.setState({ errorMessage: err.message })
        }
        this.setState({
            loading: false,
            value : '',
            instructionWhileWait: ''
        })

    }

    render(){
        return (
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Field>
                    <label>Amount to contribute</label>
                    <Input 
                        label='ether' 
                        labelPosition="right" 
                        value={this.state.value}
                        onChange={event => this.setState({ value: event.target.value})}
                    />
                </Form.Field>
                <Message error header='Oops!' content={this.state.errorMessage}/>
                <Button primary loading={this.state.loading}>Contribute!</Button>
                <p>{this.state.instructionWhileWait}</p>
                
            </Form>
        )
    }
}

export default ContributionForm;