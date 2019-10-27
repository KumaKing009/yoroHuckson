'use strict';

// Obniz用定数
var Obniz = require('obniz');
var obniz = new Obniz('8886-5918');
var obniz2 = new Obniz('2414-8389');
var stringWeight;

// Obniz関数
obniz.onconnect = async function ()
{
    obniz.display.clear();
    var hcsr04 = obniz.wired("hx711", { gnd: 0, dout: 1, sck: 2, vcc: 3 });

    while (true)
    {
        hcsr04.offset = 88815;
        hcsr04.scale = 88925;
        var val = await hcsr04.getValueWait(1);
        stringWeight = Math.abs(roundFloat(val, 4) * 10000);
        console.log(Math.abs(roundFloat(val, 4) * 10000));
        await obniz.wait(10);
        if (Number.isInteger(stringWeight) == false)
        {
            hcsr04.powerDown();
            obniz.close();
        };
    }
    function roundFloat(number, n)
    {
        var _pow = Math.pow(10, n);
        return Math.round(number * _pow) / _pow;
    }
}

if (obniz.connectionState)
{

}

obniz2.onconnect = async function ()
{
    obniz2.display.clear();
    var solenoid = obniz2.wired('Solenoid', { gnd: 0, signal: 1 });
    await obniz2.wait(3000);
    // var led = obniz2.wired("LED", { anode: 1, cathode: 0 });
    if (obniz.connectionState == 'closed')
    {
        solenoid.on();
        await obniz2.wait(3000);
        solenoid.off();
        obniz2.close();
    } else
    {
        console.log('ダメです');
    }
}