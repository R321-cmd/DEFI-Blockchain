
import React, { Component } from 'react';
import CrackToken from '../abis/CrackToken.json';
import StellarToken from '../abis/StellarToken.json';
import TokenFarm from '../abis/TokenFarm.json';
//import smart_contract from '../abis/Migrations.json';
import Web3 from 'web3';
//import logo from '../logo.png';
import Main from './Main';
import Navigation from './Navbar';
import MyCarousel from './Carousel';

class App extends Component {

  async componentDidMount() {
    // 1. Carga de Web3
    await this.loadWeb3()
    // 2. Carga de datos de la Blockchain
    await this.loadBlockchainData()
  }

  // 1. Carga de Web3
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log('Accounts: ', accounts)
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('¡Deberías considerar usar Metamask!')
    }
  }

  // 2. Carga de datos de la Blockchain
  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    // Ganache -> 5777, Rinkeby -> 4, BSC -> 97
    // console.log("Accounts[0]:", accounts[0])    
    const networkId = await web3.eth.net.getId() 
    console.log('networkid:', networkId)
    
    // const networkData = smart_contract.networks[networkId]
    // console.log('NetworkData:', networkData)

    //Carga del CrackToken 
    const crackTokenData = CrackToken.networks[networkId]
    if (crackTokenData) {
      const crackToken = new web3.eth.Contract(CrackToken.abi, crackTokenData.address)
      console.log(crackTokenData)
      this.setState({crackToken: crackToken})
      let crackTokenBalance = await crackToken.methods.balanceOf(this.state.account).call()
      this.setState({crackTokenBalance: crackTokenBalance.toString()})
      console.log(crackTokenBalance)
    }else {
      window.alert('El CrackToken no se ha desplegado en la red')
    }

    //Carga de StellarToken 
    const stellarTokenData = StellarToken.networks[networkId]
    if (stellarTokenData) {
      const stellarToken = new web3.eth.Contract(StellarToken.abi, stellarTokenData.address)
      this.setState({stellarToken: stellarToken})
      let stellarTokenBalance = await stellarToken.methods.balanceOf(this.state.account).call()
      this.setState({stellarTokenBalance: stellarTokenBalance.toString()})
      console.log(stellarTokenBalance)
    }else {
      window.alert('El stellarToken no ha sido desplegado en la red')
    }


  //   if (networkData) {
  //     const abi = smart_contract.abi
  //     console.log('abi', abi)
  //     const address = networkData.address
  //     console.log('address:', address)
  //     const contract = new web3.eth.Contract(abi, address)
  //     this.setState({ contract })
  //   } else {
  //     window.alert('¡El Smart Contract no se ha desplegado en la red!')
  //   }

      //Carga del TokenFarm 
      const tokenFarmData = TokenFarm.networks[networkId]
      if (tokenFarmData) {
        const tokenFarm = new web3.eth.Contract(TokenFarm.abi, tokenFarmData.address)
        this.setState({tokenFarm: tokenFarm})
        let stakingBalance = await tokenFarm.methods.stakingBalance(this.state.account).call()
        this.setState({stakingBalance: stakingBalance.toString()})
        console.log(stakingBalance)
      }else {
        window.alert('El tokenfram no se desplego en la red')
      }
      this.setState({loading: false})

  }

  //Realizacion del staking 
  Staker_Token = (amount) => {
    this.setState({loading: true})
    this.state.crackToken.methods.Aprobacion(this.state.tokenFarm._address, amount)
    .send({from: this.state.account})
    .on('transactionHash', (hash) => {
      this.state.tokenFarm.methods.Staker_Token(amount).send({from: this.state.account})
      .on('transactionHash', (hash) => {
        this.setState({loading: false})
      })
    })
  }

  //No se reliza el staking
  unstakeTokens = (amount) => {
    this.setState({loading: true})
    this.state.tokenFarm.methods.unstakeTokens().send({from: this.state.account})
    .on('transactionHash', (hash) => {
      this.setState({loading: false})
    })
  }


  constructor(props){
    super(props)
    this.state = {
      account: '0x0',
      loading: true,
      crackToken: {},
      crackTokenBalance: '0',
      stellarToken: {},
      stellarTokenBalance: '0',
      tokenFarm: {},
      stakingBalance: '0',
    }
  }

  render() {
    let content 
    if (this.state.loading) {
        content = <p id="loader" className='text-center'>Loading...</p>
    } else {
        content = <Main
          crackTokenBalance={this.state.crackTokenBalance}
          stellarTokenBalance={this.state.stellarTokenBalance}
          stakingBalance={this.state.stakingBalance}
          Staker_Token={this.Staker_Token}
          unstakeTokens={this.unstakeTokens}
        />
    }
    return (
      <div>
        <Navigation account={this.state.account} />
        <MyCarousel />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                {/* <a
                  href="https://blockstellart.com/rutas-de-aprendizaje/blockchain/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  { <img src={logo} className="App-logo" alt="" width="100%" height="80%" /> }
                </a>
                <h1>DApp (Autor: <a href="https://www.linkedin.com/in/joanamengual7/">Robinson Mora Palma</a>)</h1>
                <p>
                  Edita <code>src/components/App.js</code> y guarda para recargar.
                </p>
                <a
                  className="App-link"
                  href="https://blockstellart.com/rutas-de-aprendizaje/blockchain/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ¡APRENDE BLOCKCHAIN <u><b>AHORA! </b></u>
                </a> */}
                {content}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;