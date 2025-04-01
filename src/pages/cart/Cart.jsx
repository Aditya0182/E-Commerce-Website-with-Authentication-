import React, { useEffect, useState } from 'react';
import styles from './Cart.module.css';
import axios from 'axios';

const Cart = () => {
  const [userDetails, setUserDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const userid = localStorage.getItem('userid');

  useEffect(() => {
    async function getCartItems() {
      try {
        const { data } = await axios.get(`https://j-son-server.onrender.com/users/${userid}`);
        if (data.cart) {
          setUserDetails(data); // Store data to state
        } else {
          console.log('No cart data available for this user.');
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setIsLoading(false);
      }
    }
    getCartItems();
  }, []);

  let handleRemovefromCart = async (productid) => {
    try {
      const { data } = await axios.get(`https://j-son-server.onrender.com/users/${userid}`);

      // Remove item completely if quantity is 1, otherwise reduce the quantity
      let updatedCart = data.cart
        .map((item) => {
          if (item.id === productid) {
            if (item.quantity > 1) {
              const newQuantity = item.quantity - 1;
              const newPrice = (item.price / item.quantity) * newQuantity;
              return { ...item, quantity: newQuantity, price: newPrice };
            } else {
              return null; // Remove the item from the cart completely if quantity is 1
            }
          }
          return item;
        })
        .filter((item) => item !== null); // Filter out any null values (removed items)

      await axios.patch(`https://j-son-server.onrender.com/users/${userid}`, { cart: updatedCart });
      setUserDetails({ ...data, cart: updatedCart });
    } catch (error) {
      console.log('Error while removing product', error);
    }
  };

  const handleOrder = () => {
    if (userDetails.cart.length > 0) {
      alert('Your order has been placed successfully!');
      setOrderPlaced(true);
      // Optionally, you can redirect the user to a confirmation page
    } else {
      alert('Your cart is empty!');
    }
  };

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (!userDetails.cart || userDetails.cart.length === 0) {
    return <h2>Your cart is empty!</h2>;
  }

  return (
    <main className={styles.cartContainer}>
      <h1>Your Cart</h1>
      <table className={styles.cartTable}>
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Brand</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {userDetails.cart.map((item) => (
            <tr key={item.id}>
              <td><img src={item.image} alt={item.title} /></td>
              <td>{item.title.slice(0, 50)}...</td>
              <td>{item.brand}</td>
              <td>{item.quantity}</td>
              <td>${item.price * item.quantity}</td>
              <td>
                <button
                  onClick={() => handleRemovefromCart(item.id)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.placeOrderSection}>
        <button className={styles.orderButton} onClick={handleOrder}>Place Order</button>
      </div>
    </main>
  );
};

export default Cart;
