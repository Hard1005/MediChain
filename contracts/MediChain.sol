pragma solidity ^0.5.0;

contract MediChain{
    uint public count = 0;

    struct Data{
        uint id;
        string record;
    }
    
    mapping(uint => Data) public data;
    
    constructor() public{
        create_record(count , "The Genisis block data");
    }
   
    function create_record(uint id , string memory _record)public{
        data[count] = Data(id , _record);
        count++;
    }   
    
}