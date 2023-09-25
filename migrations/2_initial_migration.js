/* eslint-disable no-undef */
const CrackToken = artifacts.require('CrackToken')
const StellarToken = artifacts.require('StellarToken')
const TokenFarm = artifacts.require('TokenFarm')

module.exports = async function(deployer, network, accounts){

//despliegue de HackToken 
await deployer.deploy(CrackToken);
const crackToken = await CrackToken.deployed()


//Despliegue de CrackToken 
await deployer.deploy(StellarToken);
const stellarToken = await StellarToken.deployed();


//Despliegue del FarmToken
await deployer.deploy(TokenFarm, stellarToken.address, crackToken.address);
const tokenFarm = await TokenFarm.deployed()


//Transferir token SetllarToken (token de recompensa) a TokenFarm (1 millon de token)
await stellarToken.sendToken(tokenFarm.address, '1000000000000000000000000')

//Uso opcional
// //Transferencia de los tokens para el staking
// await crackToken.sendToken(accounts[1], '1000000000000000000000000')
}