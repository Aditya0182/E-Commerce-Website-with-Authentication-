import React, { useEffect, useState } from "react";
import styles from "./Cart.module.css";
import axios from "axios";

const Cart = () => {
  const [userDetails, setUserDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const userid = localStorage.getItem("userid");

  useEffect(() => {
    async function getCartItems() {
      try {
        const { data } = await axios.get(
          `https://j-son-server.onrender.com/users/${userid}`
        );
        if (data.cart) {
          setUserDetails(data); // Store data to state
        } else {
          console.log("No cart data available for this user.");
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setIsLoading(false);
      }
    }
    getCartItems();
  }, []);

  let handleRemoveformCart = async (productid) => {
    try {
      let { data } = await axios.get(
        `https://j-son-server.onrender.com/users/${userid}`
      );

      let updatedCart = data.cart
        .map((item) => {
          if (item.id === productid) {
            if (item.quantity > 1) {
              const newQuantity = item.quantity - 1;
              const newPrice = (item.price / item.quantity) * newQuantity;

              return {
                ...item,
                quantity: newQuantity,
                price: newPrice,
              };
            } else {
              return null;
            }
          }
          return item;
        })
        .filter((item) => item !== null);

      await axios.patch(`https://j-son-server.onrender.com/users/${userid}`, {
        cart: updatedCart,
      });

      setUserDetails({ ...data, cart: updatedCart });
    } catch (error) {
      console.log("Error while removing product", error);
    }
  };

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  // Ensure that userDetails.cart is defined before attempting to map over it
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
              <td>
                <img src={item.image} alt={item.title} />
              </td>
              <td>{item.title.slice(0, 50)}...</td>
              <td>{item.brand}</td>
              <td>{item.quantity}</td>
              <td>${item.price * item.quantity}</td>
              <td>
                <button
                  onClick={() => handleRemoveformCart(item.id)}
                  disabled={item.quantity === 1}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
};

export default Cart;
