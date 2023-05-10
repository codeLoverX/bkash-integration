/**
 * !! ATTENTION PLEASE !!
 * Please refer to the documentation at https://developer.bka.sh for information on bKash.
 */
import fs from 'fs';
import path from 'path';


export const createPayment = ({ bkash }) => async (req, res) => {
  try {
    const createAgreement = await bkash.createAgreement({
      // moved the other parameters into the bkash.createAgreement as DEFAULT ARGUMENTS 
      // that are not related to req.body
      // e.g. mode="0000"
      payerReference: req.body.phone,
      email: req.body.email,
      totalPrice: req.body.totalPrice,
    });
    if (createAgreement.statusCode === "0000" && createAgreement.statusMessage === "Successful") {
      console.log({ createAgreement })
      res.status(200).send(createAgreement);
    }
    else {
      res.status(400).send({ error: createAgreement.statusMessage });
    }
  } catch (error) {
    res.status(500).send('something went wrong');
  }
};


export const executePayment = ({ bkash, mail, config }) => async (req, res) => {
  const executeAgreement = await bkash.executeAgreement(
    {
      paymentID: req.query.paymentID
    });
  // console.log({executeAgreement})
  if (Number(executeAgreement.statusCode) !== 2054) {
    const crtPayment = await bkash.createPayment({
          payerReference: req.query.payerReference,
      amount: req.query.amount,
      agreementID: executeAgreement.agreementID,
      callbackURL: 'http://localhost:9000/api/bkash/status/?email=' + req.query.email,
      mode: "0001",
      merchantAssociationInfo: "MI05MID54RF09123456One",
      currency: "BDT",
      intent: "sale",
      merchantInvoiceNumber: "Inv0124",
    });
    // console.log({crtPayment})

    let executePay = await bkash.executePayment({ paymentID: req.query.paymentID });
    // console.log({executePay})

    // Send a Confirmation Email
    if (executePay.statusCode === '0000') {
      await mail({
        receiver: req.query.email,
        subject: 'Coding test',
        body: fs.readFileSync(path.resolve(__dirname, 'templates', 'emailTemplate.html')),
        type: 'html'
      });
    }
    return await res.redirect(crtPayment.bkashURL);
  }
  await res.redirect(config.base + '/?buy=fail');

};

export const status = ({ config }) => async (req, res) => {
  let email = req.query.email;
  res.redirect(config.base + '?buy=success&email=' + email);
};

