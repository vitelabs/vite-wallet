import BigNumber from 'bignumber.js';

BigNumber.config({ 
    FORMAT: {
        decimalSeparator: '.',
        groupSeparator: '',
        groupSize: 0,
        secondaryGroupSize: 0,
        fractionGroupSeparator: ' ',
        fractionGroupSize: 0
    }
});

const VITE_MIN_UNIT = new BigNumber('1000000000000000000');
const DP = 8;

module.exports = {
    amountToBasicString(num, decimalPlaces = DP, minUnit = VITE_MIN_UNIT) {
        num = new BigNumber(num);
        if (num.c == null) {
            return '';
        }
        try {
            return num.dividedBy(minUnit).decimalPlaces(decimalPlaces).toString();
        } catch(err) {
            console.log(`amountToBasicString: ${num}`, err);
            return '';
        }
    },
    amountToMinString(num, minUnit = VITE_MIN_UNIT) {
        num = new BigNumber(num);
        if (num.c == null) {
            return '';
        }
        try {
            return num.multipliedBy(minUnit).toFormat();
        } catch(err) {
            console.log(`amountToMinString: ${num}`, err);
            return '';
        }
    },
    isEqual(num1, num2) {
        num1 = new BigNumber(num1);
        num2 = new BigNumber(num2);
        return num1.isEqualTo(num2);
    },
    dividedToNumber(num1, num2) {
        num1 = new BigNumber(num1);
        num2 = new BigNumber(num2);
        return num1.dividedToIntegerBy(num2).integerValue().toNumber();
    }
};