'use strict';

// Obniz用定数
const Obniz = require('obniz');
var obniz = new Obniz('8886-5918');
var obniz2 = new Obniz('2414-8389');
var stringWeight;
// var beerFlag;

// Obniz関数
obniz.onconnect = async function ()
{
    obniz.display.clear();
    const hcsr04 = obniz.wired("hx711", { gnd: 0, dout: 1, sck: 2, vcc: 3 });

    while (true)
    {
        //ここの値でキャリブレーションする
        hcsr04.offset = 88815;
        hcsr04.scale = 88925;
        const val = await hcsr04.getValueWait(1);
        stringWeight = Math.abs(roundFloat(val, 4) * 10000);
        console.log(Math.abs(roundFloat(val, 4) * 10000));
        await obniz.wait(10);

        if (Number.isInteger(stringWeight) == false)
        {
            // beerFlag = true;
            // console.log(beerFlag);
            hcsr04.powerDown();
            obniz.close();
            console.log(obniz.connectionState)
        };
    }
    function roundFloat(number, n)
    {
        var _pow = Math.pow(10, n);
        return Math.round(number * _pow) / _pow;
    }
}

obniz2.onconnect = async function ()
{
    // console.log(beerFlag);
    obniz2.display.clear();
    const solenoid = obniz2.wired('Solenoid', { gnd: 0, signal: 1 });
    if (obniz.connectionState == 'closed')
    {
        solenoid.on();
        await obniz2.wait(1000);
        solenoid.off();
        obniz2.close();
    }
}