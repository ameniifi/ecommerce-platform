import React, { useState } from 'react';
import Header from './components/Header';
import ProductList from './components/ProductList';
import ShoppingCart from './components/ShoppingCart';
import './App.css';

const App = () => {
    const [cart, setCart] = useState([]);

    const addToCart = (product) => {
        setCart([...cart, product]);
    };

    return (
        <div>
            <Header />
            <ProductList addToCart={addToCart} />
            <ShoppingCart cart={cart} />
        </div>
    );
};

export default App;
