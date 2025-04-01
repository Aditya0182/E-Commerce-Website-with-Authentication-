import React, { useState, useEffect } from "react";
import styles from "./Allproducts.module.css";
import axios from "axios";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  let userid = localStorage.getItem("userid");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://fakestoreapi.in/api/products");
        const data = await response.json();
        setProducts(data.products);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  let handleAddToCart = async (product) => {
    console.log(product);
    let { data } = await axios.get(`http://localhost:3001/users/${userid}`);
    console.log(data);

    let updatedCart = data.cart ? [...data.cart] : [];

    let existingProduct = updatedCart.find((ele)=> ele.id === product.id)

    if(existingProduct){
      existingProduct.quantity += 1
    }else{
      updatedCart.push({...product,quantity:1})
    }

    await axios.patch(`http://localhost:3001/users/${userid}`,{
      cart:updatedCart
    })

    console.log("Product added");
    
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>All Products</h1>
      <div className={styles.productGrid}>
        {products.map((product) => (
          <div key={product.id} className={styles.productCard}>
            <img
              src={product.image}
              alt={product.title}
              className={styles.productImage}
            />
            <h2 className={styles.productTitle}>
              {product.title.slice(0, 30)}...
            </h2>
            <p className={styles.productPrice}>${product.price}</p>
            <p className={styles.productDescription}>
              {product.description.slice(0, 50)}...
            </p>
            <button
              className={styles.addToCartButton}
              onClick={() => handleAddToCart(product)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProducts;
