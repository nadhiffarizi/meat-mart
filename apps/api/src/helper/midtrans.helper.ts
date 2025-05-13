import { midtransEnpoint, midtransServerKey } from "@/config";
import { IUser } from "@/interface/User.interface";
import dotenv from "dotenv"

export const midtransClient = require('midtrans-client')
dotenv.config()
export const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY || '',
    clientKey: process.env.MIDTRANS_CLIENT_KEY || '',
});

export default snap;


export const midtransSnap = async (trx: { "id": string, "gross_amount": number }, user?: IUser) => {
    // if (!user) throw new Error("no user")
    let snap = new midtransClient.Snap({
        // Set to true if you want Production Environment (accept real transaction).
        isProduction: false,
        serverKey: `${midtransServerKey}`
    });

    let parameter = {
        "transaction_details": {
            "order_id": trx.id,
            "gross_amount": trx.gross_amount
        },
        "credit_card": {
            "secure": true
        },
    };

    console.log(parameter);

    const requestTrx = await snap.createTransaction(parameter)
    return { "token": requestTrx.token, "redirect_url": requestTrx.redirect_url }
}

export const requestMidtransInvoice = () => {
    const url = midtransEnpoint;
    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            authorization: `Basic ${midtransServerKey}`
        },
        body: JSON.stringify({
            transaction_details: { order_id: 'test', gross_amount: 10000 },
            credit_card: { secure: true }
        })
    };

    fetch(url, options)
        .then(res => res.json())
        .then(json => console.log(json))
        .catch(err => console.error(err));
}

