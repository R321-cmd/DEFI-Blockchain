//SPDX-License-Identifier: MIT


//Owner: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
//Usurario: 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2

//Importamos los contartos
import "./CrackToken.sol";
import "./StellarToken.sol";


//Version del compilador 
pragma solidity >=0.4.22 <0.9.0;

//Creacion del contrato
contract TokenFarm {

    //Declaraciones
    string public name =  "TokenFarm";
    address public owner;
    CrackToken public cracktoken;
    StellarToken public stellartoken;

    //Estrcutura de datos 
    address [] public stakers;
    mapping (address => uint) public stakingBalance;
    mapping (address => bool) public hasStaking;
    mapping (address => bool) public isStaking;

    //Creacion del constructor 
    constructor ( StellarToken _stellartoken, CrackToken _cracktoken){
        stellartoken = _stellartoken;
        cracktoken = _cracktoken;
        owner = msg.sender;
    }

    function Staker_Token (uint _amount) public {
        //Verificamos si es mayor a cero
        require (_amount > 0, "Debe ser mayor a cero");
        //Transferimos desde crack hacia el smart contract principal
        cracktoken.Transferencia_from(msg.sender, address(this), _amount);
        //Actualizacion del saldo del staking
        stakingBalance[msg.sender] += _amount;
        //Guardar el stakers 
        if (!hasStaking[msg.sender]){
            stakers.push(msg.sender);
        }

        //Actualizar el estado del staking 
        hasStaking[msg.sender] = true;
        isStaking[msg.sender] = true;
    }
        //Devolvemos el staking 
       function unstakeTokens () public {
            //Almacenamos el staking de un usuario en una variable
            uint balance = stakingBalance[msg.sender];
            //Se requiere que el staking sea mayor a 0
            require (balance > 0, "Debes tener 1 token por lo menos");
            //Transferimos los tokens 
            cracktoken.sendToken(msg.sender, balance);
            //Reseteo  del estado del staking 
            stakingBalance[msg.sender] = 0;
            //Actualizamos el estado del staking 
            isStaking[msg.sender] = false;            
        }

        //Emision de los Tokens
        function issueToken () public{
            //Debemos verificar que sea el owner 
            require (msg.sender == owner, "Se requiere que seas el owner");
            //Emitimos las recompensas a los stakers
            for ( uint i= 0; i < stakers.length; i++){
                address recipient = stakers[i];
                uint balance = stakingBalance[recipient];
                if (balance > 0){
                    stellartoken.sendToken(recipient, balance);
                }
            }
        }
    
}   
