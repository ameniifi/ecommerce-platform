import React from 'react';

const ShoppingCart = ({ cart }) => {
    return (
        <div>
            <h2>Shopping Cart</h2>
            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <ul>
                    {cart.map((item, index) => (
                        <li key={index}>{item.name} - ${item.price}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ShoppingCart;
