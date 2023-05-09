import axios from "axios";
import { useState } from "react";
import countryCode from "../Features/Checkout/Data/countryCode.json";
const useGlobal = () => {
  const [open, setOpen] = useState(false);
  const [mbCode, setMbCode] = useState(countryCode[15]);
  const [totalPrice, setTotalPrice] = useState(0);
  const toggleModal = () => setOpen((prev) => !prev);

  const getPayment = (body) => {
    axios.post(`${process.env.REACT_APP_SERVER_URL}/bkash/createPayment`, { ...body, totalPrice })
      .then((data) => {
        const callbackURL = data.data.callbackURL
        const paymentID = data.data.paymentID
        console.log({ callbackURL, paymentID })
        axios.post(callbackURL, { paymentID }).then((innerData) => {
          console.log({ innerData: innerData.data })
          toggleModal()
        })
      })
      .catch(error =>
        alert(`${error.response?.status || ""} Error: ${error.response?.data.error || error.message}`)
      )
  }
  return {
    toggleModal,
    open,
    setMbCode,
    mbCode,
    getPayment,
    totalPrice,
    setTotalPrice,
  };
};
export default useGlobal;
