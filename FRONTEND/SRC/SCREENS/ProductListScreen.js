// /* eslint-disable react/jsx-no-comment-textnodes */
// import ReactToPrint from 'react-to-print';
// import { useRef } from 'react';
// import React, { useContext, useEffect, useReducer } from 'react';
// import axios from 'axios';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
// import Button from 'react-bootstrap/Button';
// import { toast } from 'react-toastify';
// import { Store } from '../Store';
// import LoadingBox from '../components/LoadingBox';
// import MessageBox from '../components/MessageBox';
// import { getError } from '../utils';



// const reducer = (state, action) => {
//   switch (action.type) {
//     case 'FETCH_REQUEST':
//       return { ...state, loading: true };
//     case 'FETCH_SUCCESS':
//       return {
//         ...state,
//         products: action.payload.products,
//         page: action.payload.page,
//         pages: action.payload.pages,
//         loading: false,
//       };
//     case 'FETCH_FAIL':
//       return { ...state, loading: false, error: action.payload };
//     case 'CREATE_REQUEST':
//       return { ...state, loadingCreate: true };
//     case 'CREATE_SUCCESS':
//       return {
//         ...state,
//         loadingCreate: false,
//       };
//     case 'CREATE_FAIL':
//       return { ...state, loadingCreate: false };

//     case 'DELETE_REQUEST':
//       return { ...state, loadingDelete: true, successDelete: false };
//     case 'DELETE_SUCCESS':
//       return {
//         ...state,
//         loadingDelete: false,
//         successDelete: true,
//       };
//     case 'DELETE_FAIL':
//       return { ...state, loadingDelete: false, successDelete: false };

//     case 'DELETE_RESET':
//       return { ...state, loadingDelete: false, successDelete: false };
//     default:
//       return state;
//   }
// };

// export default function ProductListScreen() {
//   const [
//     {
//       loading,
//       error,
//       products,
//       pages,
//       loadingCreate,
//       loadingDelete,
//       successDelete,
//     },
//     dispatch,
//   ] = useReducer(reducer, {
//     loading: true,
//     error: '',
//   });

//   const navigate = useNavigate();
//   const { search } = useLocation();
//   const sp = new URLSearchParams(search);
//   const page = sp.get('page') || 1;

//   const { state } = useContext(Store);
//   const { userInfo } = state;

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const { data } = await axios.get(`/api/products/admin?page=${page} `, {
//           headers: { Authorization: `Bearer ${userInfo.token}` },
//         });

//         dispatch({ type: 'FETCH_SUCCESS', payload: data });
//       } catch (err) {}
//     };

//     if (successDelete) {
//       dispatch({ type: 'DELETE_RESET' });
//     } else {
//       fetchData();
//     }
//   }, [page, userInfo, successDelete]);

//   const createHandler = async () => {
//     if (window.confirm('Are you sure to create?')) {
//       try {
//         dispatch({ type: 'CREATE_REQUEST' });
//         const { data } = await axios.post(
//           '/api/products',
//           {},
//           {
//             headers: { Authorization: `Bearer ${userInfo.token}` },
//           }
//         );
//         toast.success('product created successfully');
//         dispatch({ type: 'CREATE_SUCCESS' });
//         navigate(`/admin/product/${data.product._id}`);
//       } catch (err) {
//         toast.error(getError(error));
//         dispatch({
//           type: 'CREATE_FAIL',
//         });
//       }
//     }
//   };

//   const deleteHandler = async (product) => {
//     if (window.confirm('Are you sure to delete?')) {
//       try {
//         await axios.delete(`/api/products/${product._id}`, {
//           headers: { Authorization: `Bearer ${userInfo.token}` },
//         });
//         toast.success('product deleted successfully');
//         dispatch({ type: 'DELETE_SUCCESS' });
//       } catch (err) {
//         toast.error(getError(error));
//         dispatch({
//           type: 'DELETE_FAIL',
//         });
//       }
//     }
//   };
//   const componentRef=useRef()
//   return (
//     <><div className='printalign'>
//       <ReactToPrint trigger={() => <button className='print' type="button" variant="light">Download Report</button>}
//       content={() => componentRef.current} />
//       </div><div ref={componentRef}>

//       <h1><center><b>E-Commerce</b></center></h1>
//     <div>
//       <Row>
//         <Col>
//           <h1>Products Report</h1>

//         </Col>
//         <Col className="col text-end">
//           <div>
//             <Button type="button" onClick={createHandler}>
//               Create Product
//             </Button>
//           </div>
//         </Col>
//       </Row>

//       {loadingCreate && <LoadingBox></LoadingBox>}
//       {loadingDelete && <LoadingBox></LoadingBox>}

//       {loading ? (
//         <LoadingBox></LoadingBox>
//       ) : error ? (
//         <MessageBox variant="danger">{error}</MessageBox>
//       ) : (
//         <>
//           <table className="table">
//             <thead>
//               <tr>

//                 <th>NAME</th>
//                 <th>PRICE</th>
//                 <th>CATEGORY</th>
//                 <th>BRAND</th>
//                 <th>STOCK</th>
//                 <th>ACTIONS</th>
//               </tr>
//             </thead>
//             <tbody>
//               {products.slice(0,15).map((product) => (
//                 <tr key={product._id}>

//                   <td>{product.name}</td>
//                   <td>{product.price}</td>
//                   <td>{product.category}</td>
//                   <td>{product.brand}</td>
//                   <td>{product.countInStock}</td>
//                   <td>
//                     <Button
//                       type="button"
//                       variant="light"
//                       onClick={() => navigate(`/admin/product/${product._id}`)}
//                     >
//                      <ebtn>Edit</ebtn> 
//                     </Button>
//                     &nbsp;
//                     <Button
//                       type="button"
//                       variant="light"
//                       onClick={() => deleteHandler(product)}
//                     >
//                      <dbtn>Delete</dbtn> 
//                     </Button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           <div>
//          {[...Array(pages).keys()].map((x) => (
//               <Link
//                 className={x + 1 === Number(page) ? 'btn text-bold' : 'btn'}
//                 key={x + 1}
//                 to={`/admin/products?page=${x + 1}`}
//               >
//                 {x + 1}
//               </Link>
//             ))} 
//           </div> 
//         </>
//       )}
//     </div></div>
// </>
//   );
// }




import ReactToPrint from 'react-to-print';
import { useRef, useState } from 'react';
import React, { useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
      return {
        ...state,
        loadingCreate: false,
      };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false, successDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};

export default function ProductListScreen() {
  const [
    {
      loading,
      error,
      products,
      pages,
      loadingCreate,
      loadingDelete,
      successDelete,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: '',
    brand: '',
    countInStock: '',
    imageUrl: ''
  });

  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get('page') || 1;

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/products/admin?page=${page}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) { }
    };

    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [page, userInfo, successDelete]);


  const createHandler = async (e) => {
    e.preventDefault();
  
    const { name, price, category, brand, countInStock, description, imageUrl } = newProduct;
  
    // Prepare the product data as JSON instead of using FormData
    const productData = {
      name,
      price,
      category,
      brand,
      countInStock,
      description,
      imageUrl,
    };
  
    try {
      dispatch({ type: 'CREATE_REQUEST' });
  
      // Send the product data as JSON to the backend
      const { data } = await axios.post(
        '/api/products', 
        productData, // Send data as JSON
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
            'Content-Type': 'application/json', // Send as JSON
          },
        }
      );
  
      toast.success('Product created successfully');
      dispatch({ type: 'CREATE_SUCCESS' });
  
      // Clear the form after successful creation
      setNewProduct({
        name: '',
        price: '',
        category: '',
        brand: '',
        countInStock: '',
        description: '',
        imageUrl: '',  // Reset imageUrl field
      });
  
      // Redirect to the newly created product's page
      navigate(`/admin/product/${data.product._id}`);
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'CREATE_FAIL' });
    }
  };
  


  const deleteHandler = async (product) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        await axios.delete(`/api/products/${product._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success('Product deleted successfully');
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (err) {
        toast.error(getError(err));
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    }
  };

  const componentRef = useRef();

  return (
    <>
      <div className="printalign">
        <ReactToPrint
          trigger={() => <button className="print" type="button">Download Report</button>}
          content={() => componentRef.current}
        />
      </div>
      <div ref={componentRef}>
        <h1><center><b>E-Commerce</b></center></h1>
        <Row>
          <Col>
            <h1>Products Report</h1>
          </Col>
          {/* <Col className="col text-end">
            <div>
              <Button type="button" onClick={() => setNewProduct({
                name: '',
                price: '',
                category: '',
                brand: '',
                countInStock: '',
              })}>
                Add New Product
              </Button>
            </div>
          </Col> */}
        </Row>

        {loadingCreate && <LoadingBox />}
        {loadingDelete && <LoadingBox />}

        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            {/* Product Form */}
            <Form onSubmit={createHandler}>
              <Row>
                <Col>
                  <Form.Group controlId="name">
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="price">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="category">
                    <Form.Label>Category</Form.Label>
                    <Form.Control
                      type="text"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="brand">
                    <Form.Label>Brand</Form.Label>
                    <Form.Control
                      type="text"
                      value={newProduct.brand}
                      onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="countInStock">
                    <Form.Label>Stock Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      value={newProduct.countInStock}
                      onChange={(e) => setNewProduct({ ...newProduct, countInStock: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      type="text"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="imageUrl">
                    <Form.Label>Image URL</Form.Label>
                    <Form.Control
                      type="text"
                      value={newProduct.imageUrl}
                      onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Button type="submit">Create Product</Button>
            </Form>


            <table className="table">
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>PRICE</th>
                  <th>CATEGORY</th>
                  <th>BRAND</th>
                  <th>STOCK</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 15).map((product) => (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td>{product.category}</td>
                    <td>{product.brand}</td>
                    <td>{product.countInStock}</td>
                    <td>
                      <Button
                        type="button"
                        variant="light"
                        onClick={() => navigate(`/admin/product/${product._id}`)}
                      >
                        Edit
                      </Button>
                      &nbsp;
                      <Button
                        type="button"
                        variant="light"
                        onClick={() => deleteHandler(product)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div>
              {[...Array(pages).keys()].map((x) => (
                <Link
                  className={x + 1 === Number(page) ? 'btn text-bold' : 'btn'}
                  key={x + 1}
                  to={`/admin/products?page=${x + 1}`}
                >
                  {x + 1}
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
