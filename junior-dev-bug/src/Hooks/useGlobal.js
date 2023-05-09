import axios from "axios";
import { useState } from "react";
import countryCode from "../Features/Checkout/Data/countryCode.json";
const useGlobal = () => {
  const [open, setOpen] = useState(false);
  const [mbCode, setMbCode] = useState(countryCode[15]);
  const [bkashURL, setBkashURL] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const toggleModal = () => setOpen((prev) => !prev);
  const getPayment = (body) => {
    axios.post(`${process.env.REACT_APP_SERVER_URL}/bkash/createPayment`, { ...body, totalPrice })
      .then((data) => {
        console.log({data})
        const bkashURL = data.data.bkashURL
        window.open(bkashURL, "_self");
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
    bkashURL,
    setBkashURL
  };
};
export default useGlobal;
