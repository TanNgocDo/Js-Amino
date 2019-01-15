const Reflection = require("./reflect")
const Encoder = require("./encoder")
let {
    Types,
    WireType,
    WireMap
} = require('./types')

const encodeBinary = (instance, type, isBare = true) => {

    let tmpInstance = instance;
    //retrieve the single property of the Registered AminoType
    if (type != Types.Struct && type != Types.Interface) { //only get the first property with type != Struct        
        let keys = Reflection.ownKeys(instance);
        if (keys.length > 0) { //type of AminoType class with single property
            keys.forEach(key => {
                let aminoType = instance.lookup(key)
                if (type != aminoType) throw new TypeError("Amino type does not match")
                tmpInstance = instance[key]
                return;
            })

        } // else tmpInstance = instance //in-case the field of Struct

    } //else {
    //  tmpInstance = instance

    // }

    let data = null;

    try {
        data = tmpInstance.marshalAmino()
        return Encoder.encodeString(data)
    } catch (err) {
        // Doesn't have method marshalAmino, continue
    }

    switch (type) {

        case Types.Int8:
        {
            data = Encoder.encodeSignedVarint(tmpInstance)
            break;
        }

        case Types.Int32:
        {
            data = Encoder.encodeInt32(tmpInstance)
            break;
        }

        case Types.Int64:
            {
                data = Encoder.encodeInt64(tmpInstance)
                break;
            }
        case Types.Boolean:
            {
                data = Encoder.encodeBoolean(tmpInstance)
                break;
            }
        case Types.String:
            {
                let encodedString = Encoder.encodeString(tmpInstance)
                data = encodedString
                break;
            }
      
        case Types.Struct:
            {
                data = encodeBinaryStruct(tmpInstance)
                break;
            }
        case Types.ByteSlice:
            {
                data = Encoder.encodeSlice(tmpInstance)
                break;

            }
        case Types.Interface:
            {
                data = encodeBinary(tmpInstance, tmpInstance.type) //dirty-hack
                return data;
            }
        default:
            {
                console.log("There is no data type to encode")
                break;
            }
    }
    if (instance.info) {
        if (instance.info.registered) {           
            instance.info.prefix[3] |= WireMap[type] //new code
            data = instance.info.prefix.concat(data)
        }
    }
    return data;

}

const encodeBinaryStruct = (instance, isBare = true) => {
    let result = []
    Reflection.ownKeys(instance).forEach((key, idx) => {
        let type = instance.lookup(key) //only valid with BaseTypeAmino.todo: checking 

        let encodeData = encodeBinaryField(instance[key], idx, type)
        if (encodeData) {
            result = result.concat(encodeData)
        }
    })

    result = result.concat(4) //append 4 as denoted for struct

    return result;

}

const encodeBinaryField = (typeInstance, idx, type) => {    
    let encodeField = Encoder.encodeFieldNumberAndType(idx + 1, WireMap[type])
    let encodeData = encodeBinary(typeInstance, type)

    return encodeField.concat(encodeData)


}

const encodeBinaryString = (input, idx) => {
    let encodeField = Encoder.encodeFieldNumberAndType(idx + 1, WireMap[Types.String])
    let encodedString = Encoder.encodeString(input)
    return encodeField.concat(encodedString);

}


module.exports = {
    encodeBinary
}
