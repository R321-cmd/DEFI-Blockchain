import React, { Component } from 'react';
import Hack from '../Hack.png';

class Main extends Component {
    render (){
        return (
            <div id="content" className="mt-3">
                <table className="table table-borderless text-muted text-center">
                    <thead>
                    <tr>
                        <th scope="col">Balance de Staking</th>
                        <th scope="col">Balance de recompensa</th> 
                    </tr>     
                    </thead>
                    <tbody>
                        <tr>
                            <td>{window.web3.utils.fromWei(this.props.stakingBalance, 'Ether')} HACK</td>
                            <td>{window.web3.utils.fromWei(this.props.stellarTokenBalance, 'Ether')} STE </td>
                        </tr>
                    </tbody>
                </table>
                <div className= 'card mb-4'>
                    <div className='card-body'>
                    
                    <form className='mb-3' onSubmit={(event) =>{
                        event.preventDefault()
                        let amount
                        amount = this.input.value.toString()
                        amount = window.web3.utils.toWei(amount, 'Ether')
                        this.props.Staker_Token(amount)
                        
                    }}>
                        <div>
                            <label className='float-left'>
                                <b>Stake Tokens</b>
                            </label>
                            <span className='float-right text-muted'>
                                Balance: {window.web3.utils.fromWei(this.props.crackTokenBalance, 'Ether')}
                            </span>
                        </div>  
                        <div className='input-group mb-4'>                  
                            <input
                                type="text"
                                ref={(input) => {this.input=input}}
                                className="from-control form-control-lg"
                                placeholder='0'
                                required/>
                            <div className='input-group-append'>
                                <div className='input-group-text'>
                                    <img src={Hack} height='32' alt=""/>
                                     &nbsp;&nbsp;&nbsp; HACK
                                </div>
                            </div>
                        </div>
                        <button type='submit' className='btn btn-primary btn-block btn-lg'>STAKING!</button> 
                    </form> 
                    <button
                        type='submit'
                        className='btn btn-link btn-block btn-lg'
                        onClick={(event) => {
                            event.preventDefault()
                            this.props.unstakeTokens()
                        }}
                    > 
                            RETIRAR STAKE</button>
                    </div> 
                </div> 
            </div>             
        );
    }
}

export default Main;