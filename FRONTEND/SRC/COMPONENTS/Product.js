// import Button from 'react-bootstrap/Button';
// import { Link } from 'react-router-dom';
// import Rating from './Rating';
// import axios from 'axios';
// import { useContext } from 'react';
// import { Store } from '../Store';
// import '../styles/Product.css'; // Import new styling if needed

// function Product(props) {
//   const { product } = props;
//   const { state, dispatch: ctxDispatch } = useContext(Store);
//   const {
//     cart: { cartItems },
//   } = state;

//   const addToCartHandler = async (item) => {
//     const existItem = cartItems.find((x) => x._id === product._id);
//     const quantity = existItem ? existItem.quantity + 1 : 1;
//     const { data } = await axios.get(`/api/products/${item._id}`);
//     if (data.countInStock < quantity) {
//       window.alert('Sorry, product is out of stock');
//       return;
//     }
//     ctxDispatch({
//       type: 'CART_ADD_ITEM',
//       payload: { ...item, quantity },
//     });
//   };

//   return (
//     <div className="product-container">
//       {/* Product Image */}
//       <div className="product-img-container">
//         <Link to={`/product/${product.slug}`} className="product-link">
//           <img src={product.image} alt={product.name} className="product-image" />
//         </Link>
//       </div>

//       {/* Product Content */}
//       <div className="product-body">
//         <Link to={`/product/${product.slug}`} className="product-title">
//           <h2>{product.name}</h2>
//         </Link>
//         <Rating rating={product.rating} numReviews={product.numReviews} />
//         <p className="product-price">Rs {product.price}</p>
//         <div className="button-container">
//           {product.countInStock === 0 ? (
//             <Button variant="secondary" disabled className="out-of-stock-btn">
//               Out of Stock
//             </Button>
//           ) : (
//             <Button className="add-to-cart-btn" onClick={() => addToCartHandler(product)}>
//               Add to Cart
//             </Button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Product;

import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import axios from 'axios';
import { useContext } from 'react';
import { Store } from '../Store';
import '../styles/Product.css'; 

function Product(props) {
  const { product } = props;
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  // Get user data from localStorage
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const isAdmin = userInfo && userInfo.isAdmin;

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry, product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };

  return (
    <div className="product-container">
      {/* Product Image */}
      <div className="product-img-container">
        <Link to={`/product/${product.slug}`} className="product-link">
          <img src={product.image} alt={product.name} className="product-image" />
        </Link>
      </div>

      {/* Product Content */}
      <div className="product-body">
        <Link to={`/product/${product.slug}`} className="product-title">
          <h2>{product.name}</h2>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <p className="product-price">Rs {product.price}</p>
        <div className="button-container">
          {/* Disable Add to Cart if admin is logged in */}
          {isAdmin ? (
            <Button variant="secondary" disabled className="out-of-stock-btn">
              Admin cannot add products to cart
            </Button>
          ) : product.countInStock === 0 ? (
            <Button variant="secondary" disabled className="out-of-stock-btn">
              Out of Stock
            </Button>
          ) : (
            <Button className="add-to-cart-btn" onClick={() => addToCartHandler(product)}>
              Add to Cart
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Product;





