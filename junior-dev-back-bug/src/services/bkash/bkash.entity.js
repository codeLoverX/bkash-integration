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
    if (createAgreement.statusCode==="0000" && createAgreement.statusMessage==="Successful"){
      res.status(200).send(createAgreement);
    }
    else{
      res.status(400).send({error: createAgreement.statusMessage});
    }
  } catch (error) {
    res.status(500).send('something went wrong');
  }
};

export const executePayment = ({ bkash, mail, config }) => async (req, res) => {
  let email = req.query.email;
  const execute = await bkash.executeAgreement(req.body.paymentID);
  console.log({execute, paymentID: req.body.paymentID})
  if (Number(execute.statusCode) !== 2054) {
    const crtPayment = await bkash.createPayment({
      mode: '0001', merchantAssociationInfo: 'MI05MID54RF09123456One',
      merchantInvoiceNumber: 'Inv0121', amount: req.query.totalPrice, agreementID: execute?.agreementID,
      baseURL: config.api + '/api/bkash/status?email=' + email
    });
    let createPay = await bkash.executePayment({ paymentID: crtPayment.paymentID });
    // Send a Confirmation Email
    console.log({createPay})
    if (createPay.statusCode === '0000') {
      await mail({
        receiver: req.query.email,
        subject: 'Coding test',
        body: fs.readFileSync(path.resolve(__dirname, 'templates', 'emailTemplate.html')),
        type: 'html'
      });
    }
    c
    // Redirect to webpage to show a modal
    return await res.redirect(crtPayment.bkashURL);
  }
  await res.redirect(config.base);
};

export const status = ({ config }) => async (req, res) => {
  let email = req.query.email;
  res.redirect(config.base + '?buy=success?email=' + email);
};


export const sendHello2 = ({ bkash }) => async (_req, res) => {
  res.send(bkash);
};