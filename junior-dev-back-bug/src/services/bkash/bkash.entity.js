/**
 * !! ATTENTION PLEASE !!
 * Please refer to the documentation at https://developer.bka.sh for information on bKash.
 */
import fs from 'fs';
import path from 'path';


export const createPayment = ({ bkash }) => async (req, res) => {
  try {
    // const createAgreement = await bkash.createAgreement({
    //   payerReference: req.body.phone,
    //   email: req.body.email,
    //   totalPrice: req.body.totalPrice,
    // });
    const crtPayment = await bkash.createPayment({
      payerReference: req.body.phone,
      amount: req.body.totalPrice,
      // agreementID: execute.agreementID,
      email: req.body.email
    });
    if (crtPayment.statusCode === "0000" && crtPayment.statusMessage === "Successful") {
      console.log({ crtPayment })
      res.status(200).send(crtPayment);
    }
    else {
      res.status(400).send({ error: crtPayment.statusMessage });
    }
  } catch (error) {
    res.status(500).send('something went wrong');
  }
};


export const executePayment = ({ bkash, mail, config }) => async (req, res) => {
  // let email = req.query.email;
  // const execute = await bkash.executeAgreement(
  //   {
  //     paymentID: req.query.paymentID
  //   });
  // if (Number(execute.statusCode) !== 2054) {
    // const crtPayment = await bkash.createPayment({
    //   payerReference: req.query.payerReference,
    //   amount: req.query.amount,
    //   agreementID: execute.agreementID
    // });
    // console.log({ crtPayment })

    let executePay = await bkash.executePayment({ paymentID: req.query.paymentID });
    console.log({ executePay })

    // Send a Confirmation Email
    if (executePay.statusCode === '0000') {
      await mail({
        receiver: req.query.email,
        subject: 'Coding test',
        body: fs.readFileSync(path.resolve(__dirname, 'templates', 'emailTemplate.html')),
        type: 'html'
      });
      const url = 'http://localhost:9000/api/bkash/status/?email=' + req.query.email;
      return await res.redirect(url);
    }
    // return await res.redirect(crtPayment.bkashURL);
  // }
  await res.redirect(config.base + '/?buy=fail');

};

export const status = ({ config }) => async (req, res) => {
  let email = req.query.email;
  res.redirect(config.base + '?buy=success&email=' + email);
};

