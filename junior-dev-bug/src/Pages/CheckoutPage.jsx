import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGlobalCtx } from '../Contexts/GlobalProvider';
import Checkout from '../Features/Checkout/Components/Checkout';

export default function CheckoutPage() {
    const [searchParams] = useSearchParams();

    const { toggleModal } = useGlobalCtx();

    useEffect(() => {
        console.log({searchParams})
        if (searchParams.get("status") === "success") {
            toggleModal();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams.get("cancel")])
    return (
        <Checkout />
    )
}
