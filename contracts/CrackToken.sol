//SPDX-License-Identifier: MIT

//Version del compilador 
pragma solidity ^0.8.4;

//Persona 1: Owner: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
//Persona 2: Usuario: 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2


//Creacion del contrato 
contract CrackToken {
    //Declaraciones 
    string constant public name = "Robinson";
    string  constant public symbol = "CrackToken";
    uint256 constant public totalsupply = 1000000000000000000000000; // 1 millon de tokens
    uint256 constant public decimal = 18;    

    //Evento para la transferencia de token de un usuario
    event transfer (
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    //Evento para la aprobacion de un operador 
    event Aprroval (
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    //Estrcutura de datos 
    mapping(address => uint256) public balanceOf;
    mapping (address => mapping (address => uint)) public allowance;


    constructor (){
        balanceOf[msg.sender] = totalsupply;
    }

    //Funciones de control y transferencia de tokens
    function sendToken(address _to, uint256 _value) public returns(bool success){
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit transfer (msg.sender, _to, _value);
        return true;
    }

    //Aprobacion para ser gastada por un operador 
    function Aprobacion (address _spender, uint256 _value) public returns(bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Aprroval(msg.sender, _spender, _value);
        return true;
    }

    //Funcion de transferenia de tokens desde el emisor 
    //Owner(20 Tokens) = Operador (5 Token) = 15 Tokens
    function Transferencia_from (address _from, address _to, uint256 _value) public returns(bool sucess){
        //Vemos la disponibilidad que tenemos de tokens
        require(_value <= balanceOf[_from]);
        //Vemos los tokens que tiene a disposicion el emisor 
        require(_value <= allowance[_from][msg.sender]);
        //Decremetamos los token del emisor 
        balanceOf[_from] -= _value;
        //Aumentamos los token de ls persona que recibe esos tokens
        balanceOf[_to] += _value;
        //Decremtamos los tokens del operados 
        allowance[_from][msg.sender] -= _value;
        emit transfer(_from, _to, _value);
        return true;

    }

}   