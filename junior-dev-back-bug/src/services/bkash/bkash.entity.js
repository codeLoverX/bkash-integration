/**
 * !! ATTENTION PLEASE !!
 * Please refer to the documentation at https://developer.bka.sh for information on bKash.
 */
import fs from 'fs';
import path from 'path';

// export const createPayment = ({ bkash }) => async (_req, res) => {
//   res.send(bkash);
// };

export const createPayment = ({ bkash }) => async (req, res) => {
  try {
    const createAgreement = await bkash.createAgreement({
      payerReference: req.body.phone,
      email: req.body.email,
      totalPrice: req.body.totalPrice,
      mode: '0000'
    });
    if (createAgreement.statusCode === "0000" && createAgreement.statusMessage === "Successful") {
      // const execute = await bkash.executeAgreement(
      //   {
      //     payerReference: req.body.phone,
      //     paymentID: createAgreement.paymentID
      //   });
      // console.log({ execute, paymentID: createAgreement.paymentID })
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
  // let email = req.query.email;
  const execute = await bkash.executeAgreement(
    {
      paymentID: req.query.paymentID
    });
  if (Number(execute.statusCode) !== 2054) {
    const crtPayment = await bkash.createPayment({
      payerReference: req.query.payerReference,
      callbackURL: config.base + '/?email=' + req.query.email,
      merchantAssociationInfo: "MI05MID54RF09123456One",
      amount: req.query.amount,
      currency: "BDT",
      intent: "sale",
      merchantInvoiceNumber: "Inv0124",
      // merchantInvoiceNumber: 'Inv0121', 
    });
    console.log({ crtPayment })

    let executePay = await bkash.executePayment({ paymentID: crtPayment.paymentID });
    console.log({ executePay })

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
  await res.redirect(config.base+ '/?status=' + req.query.status);

};

export const status = ({ config }) => async (req, res) => {
  let email = req.query.email;
  res.redirect(config.base + '?buy=success?email=' + email);
};

