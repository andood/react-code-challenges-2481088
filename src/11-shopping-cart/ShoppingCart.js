import { useReducer } from 'react';

const initialState = {
  cart: [],
  total: 0
}

const items = [{
  name: 'apple',
  price: 0.39
}, {
  name: 'banana',
  price: 0.79
}, {
  name: 'cherry tomatoes',
  price: 3.99
}]

function cartReducer (state, action) {
  const { type, item } = action;

  const calcCartTotal = cart => {
    const grandTotal = cart.map(item => item.price * item.quantity)
      .reduce((prev, curr) => {
        return prev + curr
      }, 0);
    return grandTotal.toFixed(2);
  }

  let updatedCart, cartTotal;

  switch (type) {
    case "ADD": {
      if (state.cart.length === 0) {
        updatedCart = [...state.cart, {...item, quantity: 1}];
      }

      // See if there is a match
      if (state.cart.map(i => i.name).includes(item.name)) {
        updatedCart = state.cart.map(cartItem => {
          if (cartItem.name === item.name) return {...cartItem, quantity: cartItem.quantity + 1}
          return cartItem
        });
      } else {
        updatedCart = [...state.cart, {...item, quantity: 1}]
      }
      cartTotal = calcCartTotal(updatedCart);
      return { ...state, cart: updatedCart, total: cartTotal }
    }
    case "INCREASE": 
      updatedCart = state.cart.map(cartItem => {
        if (cartItem.name === item.name) return {...cartItem, quantity: cartItem.quantity + 1}
        return cartItem
      });
      cartTotal = calcCartTotal(updatedCart);
      return { ...state, cart: updatedCart, total: cartTotal }

    case "DECREASE":
      let newQty;
      updatedCart = state.cart.map(cartItem => {
        if (cartItem.name === item.name) {
          newQty = cartItem.quantity - 1;
          return {...cartItem, quantity: newQty}
        }
        return cartItem
      });
      
      // If action results in 0 quantity, remove item from cart
      if (newQty === 0) {
        updatedCart = updatedCart.filter(item => item.quantity > 0);
      }

      cartTotal = calcCartTotal(updatedCart);
      return { ...state, cart: updatedCart, total: cartTotal }

    default: 
      return state
  }
}

function ShoppingCart () {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const { cart, total } = state;

  const calcItemTotal = item => parseFloat(item.quantity * item.price).toFixed(2);

  return (
    <div>
      <h1>Shopping Cart</h1>
      <div className='cart'>
        <div className='items'>
          <h2>Items</h2>
          {items.map(item => (
            <div key={item.name}>
              <h3>{item.name}</h3>
              <p>${item.price}</p>
              <button onClick={() => dispatch({ type: 'ADD', item})}>Add to Cart</button>
            </div>)
          )}
        </div>
        <div>
          <h2>Cart</h2>
          {cart.map(item => (
            <div key={item.name}>
              <h3>{item.name}</h3>
              <p>
                <button onClick={() => dispatch({ type: "DECREASE", item})}>-</button>
                {item.quantity}
                <button onClick={() => dispatch({ type: "INCREASE", item})}>+</button>
              </p>
              <p>Subtotal: ${calcItemTotal(item)}</p>
            </div>
          ))}
        </div>
      </div>
      <div className='total'>
        <h2>Total: ${total}</h2>
      </div>
    </div>
  )
}

export default ShoppingCart
