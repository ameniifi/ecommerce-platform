import React from 'react';
import styled from 'styled-components';

const ProductContainer = styled.div`
    border: 1px solid #ddd;
    padding: 10px;
    margin: 10px;
    text-align: center;
`;

const Button = styled.button`
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    cursor: pointer;

    &:hover {
        background-color: #0056b3;
    }
`;

const ProductItem = ({ product, addToCart }) => {
    return (
        <ProductContainer>
            <h2>{product.name}</h2>
            <p>${product.price}</p>
            <Button onClick={() => addToCart(product)}>Add to Cart</Button>
        </ProductContainer>
    );
};

export default ProductItem;
