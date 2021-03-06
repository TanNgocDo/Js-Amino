const {
    Codec,
    FieldOptions,
    TypeFactory,
    Utils,
    Types,
    WireTypes,
} = require('../index');

let StdTx = TypeFactory.create('StdTx', [{
        name: 'msg',
        type: Types.ArrayInterface,
    },
    {
        name: 'fee',
        type: Types.Struct,
    },
    {
        name: 'signatures',
        type: Types.ArrayStruct,
    },
    {
        name: 'memo',
        type: Types.String,
    },
]);

let MsgMultiSend = TypeFactory.create('MsgMultiSend', [{
        name: "inputs",
        type: Types.ArrayStruct
    },
    {
        name: "outputs",
        type: Types.ArrayStruct 
    }
]);

let Coin = TypeFactory.create('coin', [{
        name: 'denom',
        type: Types.String,
    },
    {
        name: 'amount',
        type: Types.String,
    }
]);

let Input = TypeFactory.create('input', [{
        name: 'address',
        type: Types.String,
    },
    {
        name: 'coins',
        type: Types.ArrayStruct,
    }
]);

let Output = TypeFactory.create('output', [{
        name: 'address',
        type: Types.String,
    },
    {
        name: 'coins',
        type: Types.ArrayStruct,
    }
]);

let Fee = TypeFactory.create('fee', [{
        name: 'amount',
        type: Types.ArrayStruct,
    },
    {
        name: 'gas',
        type: Types.Int64,
    }
]);

let PubKeySecp256k1 = TypeFactory.create('PubKeySecp256k1', [{
    name: 's',
    type: Types.ByteSlice,
}], Types.ByteSlice)

let Signature = TypeFactory.create('signature', [{
        name: 'pub_key',
        type: Types.Interface,
    },
    {
        name: 'signature',
        type: Types.ByteSlice,
    }
])

let codec = new Codec();

codec.registerConcrete(new StdTx(), 'auth/StdTx', {});
codec.registerConcrete(new MsgMultiSend(), 'cosmos-sdk/MsgMultiSend', {});
codec.registerConcrete(new PubKeySecp256k1(), 'tendermint/PubKeySecp256k1', {});

let coin = new Coin('cyb', "10000");

let addressFrom = [ 59,58,243,13,132,163,164,202,233,7,236,93,136,166,181,175,236,69,48,186 ]
let addressTo = [ 94,222,114,42,196,107,51,203,139,142,219,243,137,60,54,250,139,153,46,168 ]
  
let input = new Input(addressFrom, [coin]);
let output = new Output(addressTo, [coin]);
let sendMultiMsg = new MsgMultiSend([input], [output]);
let fee = new Fee([new Coin('cyb', '0')], 200000);

let pubKey = new PubKeySecp256k1([2,27,24,0,255,96,147,21,64,29,132,192,108,219,59,134,206,201,126,224,63,160,24,236,170,124,164,95,43,180,6,246,250]);
let signature = [165,76,109,61,53,129,190,147,52,224,34,106,235,208,224,36,190,25,204,36,226,129,97,109,35,130,217,228,144,106,10,134,14,183,95,252,219,235,22,92,37,53,3,89,111,173,12,158,146,71,82,113,236,241,170,121,217,20,236,23,131,35,80,29];

let sig = new Signature(pubKey, signature);
let stdTx = new StdTx([sendMultiMsg], fee, [sig], 'elonmusk');

let jsonTx = codec.marshalJson(stdTx);
let decodedDataTx = new StdTx();

// console.log("binary coin:\n ", (codec.marshalBinary(coin)).toString());
// console.log("binary input:\n ", (codec.marshalBinary(input)).toString());
// console.log("binary output:\n ", (codec.marshalBinary(output)).toString());
// console.log("binary msg:\n ", (codec.marshalBinary(sendMultiMsg)).toString());
// console.log("binary fee:\n ", (codec.marshalBinary(fee)).toString());
// console.log("binary sig:\n ", (codec.marshalBinary(sig)).toString());
console.log("Binary stdTx:\n ", (codec.marshalBinary(stdTx)).toString());

console.log("Json:\n", jsonTx);
codec.unMarshalBinary(codec.marshalBinary(stdTx), decodedDataTx);
console.log("Decoded data:\n", decodedDataTx.JsObject());
