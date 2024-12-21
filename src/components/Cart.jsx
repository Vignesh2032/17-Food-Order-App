import { useContext } from "react";
import Modal from "./UI/Modal";
import CartContext from "../store/CartContext";
import { currencyFormatter } from "../util/formatting";
import Button from "./UI/Button";
import UserProgressContext from "../store/UserProgressContext";
import CartItem from "./CartItem";

export default function Cart() {
    const { items, addItem, removeItem } = useContext(CartContext);
    const { progress, hideCart, showCheckout } = useContext(UserProgressContext);

    const cartTotal = items.reduce((cartTotalPrice, item) => {
        return cartTotalPrice += (item.price * item.quantity);
    }, 0);

    function handleCloseCart() {
        hideCart();
    }

    function handleGoToCheckout() {
        showCheckout();
    }
    return (
        <Modal className="cart" open={progress === 'cart'} onClose={progress === 'cart' ? handleCloseCart : null}>
            <h2>Your Cart</h2>
            <ul>
                {items.map((item) =>
                    <CartItem
                        key={item.id}
                        name={item.name}
                        price={item.price}
                        quantity={item.quantity}
                        onIncrease={() => addItem(item)}
                        onDecrease={() => removeItem(item.id)}
                    />
                )}
            </ul>
            <p className="cart-total">{currencyFormatter.format(cartTotal)}</p>
            <p className="modal-actions">
                <Button textOnly onClick={handleCloseCart}>Close</Button>
                {items.length > 0 && <Button onClick={handleGoToCheckout}>Go to Checkout</Button>}
            </p>
        </Modal>
    );
}