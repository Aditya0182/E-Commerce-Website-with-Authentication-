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
          `http://localhost:3001/users/${userid}`
        );
        setUserDetails(data); // Store data to state
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
      let { data } = await axios.get(`http://localhost:3001/users/${userid}`);

      let updatedCart = data.cart
        .map((item) => {
          if (item.id === productid) {
            if (item.quantity > 1) {
              // Reduce the quantity
              return {
                ...item,
                quantity: item.quantity - 1,
                price: item.price - Math.floor(item.price / item.quantity),
              };
            } else {
              return null;
            }
          }
          return item;
        })
        .filter((item) => item !== null);
      console.log(updatedCart);

      await axios.patch(`http://localhost:3001/users/${userid}`, {
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
                <button onClick={() => handleRemoveformCart(item.id)}>
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
