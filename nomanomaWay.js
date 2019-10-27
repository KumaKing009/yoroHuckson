'use strict';

const express = require('express');
const line = require('@line/bot-sdk');
const PORT = process.env.PORT || 3000;
const Obniz = require('obniz');
var obniz = new Obniz('8886-5918');
var obniz2 = new Obniz('2414-8389');
var stringWeight;
var ledFlag;

const config = {
    channelSecret: 'a26780255df32e69b41b1090ddcaf69b',
    channelAccessToken: 'qIGhGGXDr+OUm3+J9JgNXLcuv4A5Jl53LhtATpRP77KG1VVr6n3MWOdBMlf9N67onDmLwrPcM2bTUumCa6gTsX821WVp3mzkQoF9NImZZwwUUgMHOxIMOLl9kei4kSdawhbcaziZcJkbnQdnaFwosAdB04t89/1O/w1cDnyilFU='
};

const app = express();

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
        if (Number.isInteger(stringWeight) == false)
        {
            obniz2.onconnect = async function ()
            {
                obniz.display.clear();
                const led = obniz.wired("LED", { anode: 0, cathode: 1 });
                led.on();
                ledFlag = true;
            }
        };
    }
    function roundFloat(number, n)
    {
        var _pow = Math.pow(10, n);
        return Math.round(number * _pow) / _pow;
    }
}

app.post('/webhook', line.middleware(config), (req, res) =>
{
    console.log(req.body.events);
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result));
});

const client = new line.Client(config);

function handleEvent(event)
{
    if (event.type !== 'message' || event.message.type !== 'text')
    {
        return Promise.resolve(null);
    }

    if (ledFlag == true)
    {
        return client.replyMessage(event.replyToken, {
            type: 'text',
            text: 'グラス空いてるぜ'
        });
    }
}

app.listen(PORT);
console.log(`Server running at ${PORT}`);