import { useContext } from "react";
import Modal from "./UI/Modal";
import UserProgressContext from "../store/UserProgressContext";
import CartContext from "../store/CartContext";
import { currencyFormatter } from "../util/formatting";
import Input from "./UI/Input";
import Button from "./UI/Button";
import useHttp from "../hooks/useHttp";
import Error from "./Error";
import { useActionState } from "react";

const requestConfig = {
    method: "POST",
    headers: {
        'Content-Type': 'application/json'
    }
}

export default function Checkout() {

    const { items, clearItem } = useContext(CartContext);
    const { progress, hideCheckout } = useContext(UserProgressContext);

    const {
        data,
        //isLoading: isSending,
        error,
        sendRequest
    } = useHttp("http://localhost:3000/orders", requestConfig);

    const cartTotal = items.reduce((cartTotalPrice, item) => {
        return cartTotalPrice += (item.price * item.quantity);
    }, 0);

    function handleCloseCheckout() {
        hideCheckout();
    }

    function handleFinish() {
        hideCheckout();
        clearItem();
    }

    //function handleSubmit(event) {
    async function checkoutAction(prevState, fd) {
        //event.preventDefault();

        //const fd = new FormData(event.target);
        const customerData = Object.fromEntries(fd.entries());

        await sendRequest(
            JSON.stringify({
                order: {
                    items,
                    customer: customerData
                }
            })
        );
    }

    const [formState, formAction, isSending] = useActionState(checkoutAction, null);

    let actions = (
        <>
            <Button type="button" textOnly onClick={handleCloseCheckout}>Close</Button>
            <Button>Submit Order</Button>
        </>
    )

    if (isSending) {
        actions = <span>Sending order data...</span>
    }

    if (data && !error) {
        return (
            <Modal open={progress === 'checkout'} onClose={handleFinish}>
                <h2>Success!</h2>
                <p>Your order was submitted successfully.</p>
                <p>We'll get back to you with more details via email within the next few minutes.</p>
                <Button onClick={handleFinish}>Okay</Button>
            </Modal>
        )
    }
    return (
        <Modal open={progress === 'checkout'} onClose={handleCloseCheckout}>
            <form
                //onSubmit={handleSubmit}
                action={formAction}
            >
                <h2>Checkout</h2>
                <p>Total amount: {currencyFormatter.format(cartTotal)}</p>
                <Input label="Full Name" id="name" type="text" />
                <Input label="E-mail Address" id="email" type="email" />
                <Input label="Street" id="street" type="text" />
                <div className="control-row">
                    <Input label="Postal Code" id="postal-code" type="text" />
                    <Input label="City" id="city" type="text" />
                </div>

                {error && <Error title="Failed to submit order" message={error} />}

                <p className="modal-actions">
                    {actions}
                </p>
            </form>
        </Modal>
    );
}