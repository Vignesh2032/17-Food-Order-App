import { useContext } from 'react';
import AppLogo from '../assets/logo.jpg'
import Button from './UI/Button';
import CartContext from '../store/CartContext';
import UserProgressContext from '../store/UserProgressContext';

export default function Header() {
    const { items } = useContext(CartContext);
    const { showCart } = useContext(UserProgressContext)

    const totalCartItems = items.reduce((totalNumberOfItem, item) => {
        return totalNumberOfItem + item.quantity;
    }, 0);

    function handleShowCart() {
        showCart();
    }
    return (
        <header id="main-header">
            <div id="title">
                <img src={AppLogo} alt="App Logo" />
                <h1>Food App</h1>
            </div>
            <nav>
                <Button textOnly onClick={handleShowCart}>Cart ({totalCartItems})</Button>
            </nav>
        </header>
    );
}