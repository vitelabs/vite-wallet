class Types {
    constructor() {}

    isValidAddress(addr) {
        return global.goViteIPC['types.IsValidHexAddress'](addr);
    }

    isValidTokenId(tokenId) {
        return global.goViteIPC['types.IsValidHexTokenTypeId'](tokenId);
    }
}

module.exports = Types;