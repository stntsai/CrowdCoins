import React, {Component} from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import Layout from "../../components/Layout";
import factory from '../../ethereum/factory';
import web3 from "../../ethereum/web3";
import { Link, Router } from '../../routes';

class newCampaign extends Component{
    state = {
        minimumContribution: '',
        errorMessage: '',
        instructionWhileWait: '',
        loading: false
    };

    onSubmit = async (event)=>{
        event.preventDefault();

        this.setState({loading: true, instructionWhileWait: 'Please wait for creation(up to 30 secs)..',errorMessage: ''});

        try{
            const accounts = await web3.eth.getAccounts()
            await factory.methods.createCampaign(this.state.minimumContribution).send({
                from: accounts[0]
            });
            Router.pushRoute('/');
        } catch(err){
            this.setState({errorMessage: err.message});
        }

        this.setState({loading: false, instructionWhileWait:''});
        
    };

    render(){
        return (
            <Layout>
                <h1>New Campaign</h1>
                
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Minimum Contribution</label>
                        <Input 
                            label="wei" 
                            labelPosition="right"
                            value = {this.state.minimumContribution}
                            onChange={event=>this.setState({minimumContribution: event.target.value})}
                        />
                    </Form.Field>

                    <Message error header='Oops!' content={this.state.errorMessage} />
                    <Button loading={this.state.loading} primary>Create</Button>
                    <Link route={`/`}>
                        <a>    Go Back</a>
                    </Link>
                    <p>{this.state.instructionWhileWait}</p>
                </Form>
                
            </Layout>
        )
    } 
}

export default newCampaign;