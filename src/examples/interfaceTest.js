let {
    Codec,
    FieldOptions,
    TypeFactory,
    Utils,
    Types,
    WireTypes
} = require('../index')

//let codec1 = new Codec();

let Tx = TypeFactory.create('Tx', [{
    name: "msg",
    type: Types.Interface
}])

let MsgSend = TypeFactory.create('MsgSend', [{
    name: "nonce",
    type: Types.Int64
}])

//interface 2 with byte-slice array
let Tx2 = TypeFactory.create('Tx2', [{
    name: "pubKey",
    type: Types.Interface
}])

let PubSecp256k1 = TypeFactory.create('PubSecp256k1', [{
        name: "bytes",
        type: Types.ByteSlice
    }

], Types.ByteSlice)




let codec = new Codec()
codec.registerConcrete(new Tx(), "shareledger/bank/Tx", {})
codec.registerConcrete(new MsgSend(), "shareledger/bank/MsgSend", {})

codec.registerConcrete(new Tx2(), "shareledger/bank/Tx2", {})
codec.registerConcrete(new PubSecp256k1(), "shareledger/PubSecp256k1", {})

let msgSend = new MsgSend(3)
let tx = new Tx(msgSend)
let binary = codec.marshalBinary(tx,new FieldOptions({binFixed64: true, binFixed32: true}))
console.log("binary=",binary)
let decodedTx = new Tx();
codec.unMarshalBinary(binary,decodedTx, new FieldOptions({binFixed64: true, binFixed32: true}))
console.log("decodedTx=",JSON.stringify(decodedTx.JsObject()))


let pubKey = new PubSecp256k1([1, 2, 3])
//let tx2 = new Tx2(pubKey)
//let binary2 = codec.marshalBinary(tx2,new FieldOptions({binFixed64: true, binFixed32: true}))


//console.log(Utils.toHex(binary))
//console.log(binary2.toString())

//console.log(bObj)
