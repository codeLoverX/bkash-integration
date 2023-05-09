import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGlobalCtx } from '../Contexts/GlobalProvider';
import Checkout from '../Features/Checkout/Components/Checkout';

export default function CheckoutPage() {
    const [searchParams] = useSearchParams();

    const { toggleModal } = useGlobalCtx();

    useEffect(() => {
    
        if (searchParams.has("status")){
            const status = searchParams.get("status");
            console.log({status, equals: status === "success"})
            if (status === "success") {
                toggleModal(true);
            }
            else {
                alert(`This is the current status of payment: ${status}`)
            }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <Checkout />
    )
}
