import Axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { useContext, useEffect, useState } from 'react';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';

export default function SignupScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nic, setNic] = useState('');
  const [phone, setphone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const { data } = await Axios.post('/api/users/signup', {
        name,
        email,
        nic,
        phone,
        address,
        password,
      });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect || '/');
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <Container className="small-container">
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
      <h1 className="my-3">Sign Up</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control onChange={(e) => setName(e.target.value)} required />
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="nic">
          <Form.Label>Nic</Form.Label>
          <Form.Control
            maxLength={12}
            minLength={9}
            required
            onChange={(e) => setNic(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="address">
          <Form.Label>Address</Form.Label>
          <Form.Control
            
            required
            onChange={(e) => setAddress(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="phone">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
          maxLength={10}
          type="tel"
          pattern="[0-9]{10}"
          required
          onKeyPress={(e) => {
          if (isNaN(parseInt(e.key))) {
          e.preventDefault();
          }
          }}
          onChange={(e) => setphone(e.target.value)}
          />
          </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            minLength={6}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Form.Group className="mb-3" controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
          </Form.Group>
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Sign Up</Button>
        </div>
        <div className="mb-3">
          Already have an account?{' '}
          <Link to={`/signin?redirect=${redirect}`}>Sign-In</Link>
        </div>
      </Form>
    </Container>
  );
}




// import Axios from 'axios';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import Container from 'react-bootstrap/Container';
// import Form from 'react-bootstrap/Form';
// import Button from 'react-bootstrap/Button';
// import { Helmet } from 'react-helmet-async';
// import { useContext, useEffect, useState } from 'react';
// import { Store } from '../Store';
// import { toast } from 'react-toastify';
// import { getError } from '../utils';
// import { Row, Col } from 'react-bootstrap';

// export default function SignupScreen() {
//   const navigate = useNavigate();
//   const { search } = useLocation();
//   const redirectInUrl = new URLSearchParams(search).get('redirect');
//   const redirect = redirectInUrl ? redirectInUrl : '/';

//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [nic, setNic] = useState('');
//   const [phone, setPhone] = useState('');
//   const [address, setAddress] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');

//   const { state, dispatch: ctxDispatch } = useContext(Store);
//   const { userInfo } = state;

//   const submitHandler = async (e) => {
//     e.preventDefault();
//     if (password !== confirmPassword) {
//       toast.error('Passwords do not match');
//       return;
//     }
//     try {
//       const { data } = await Axios.post('/api/users/signup', {
//         name,
//         email,
//         nic,
//         phone,
//         address,
//         password,
//       });
//       ctxDispatch({ type: 'USER_SIGNIN', payload: data });
//       localStorage.setItem('userInfo', JSON.stringify(data));
//       navigate(redirect || '/');
//     } catch (err) {
//       toast.error(getError(err));
//     }
//   };

//   useEffect(() => {
//     if (userInfo) {
//       navigate(redirect);
//     }
//   }, [navigate, redirect, userInfo]);

//   return (
//     <Container className="d-flex justify-content-center align-items-center vh-100">
//       <Helmet>
//         <title>Sign Up</title>
//       </Helmet>
//       <Row className="w-100">
//         <Col sm={12} md={8} lg={6} className="mx-auto bg-light p-4 rounded shadow-lg">
//           <h1 className="text-center mb-4">Create Your Account</h1>
//           <Form onSubmit={submitHandler}>
//             <Form.Group className="mb-3" controlId="name">
//               <Form.Label>Name</Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="Enter your full name"
//                 required
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className="form-control-lg"
//               />
//             </Form.Group>

//             <Form.Group className="mb-3" controlId="email">
//               <Form.Label>Email Address</Form.Label>
//               <Form.Control
//                 type="email"
//                 placeholder="Enter your email"
//                 required
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="form-control-lg"
//               />
//             </Form.Group>

//             <Form.Group className="mb-3" controlId="nic">
//               <Form.Label>NIC</Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="Enter your NIC"
//                 maxLength={12}
//                 minLength={9}
//                 required
//                 value={nic}
//                 onChange={(e) => setNic(e.target.value)}
//                 className="form-control-lg"
//               />
//             </Form.Group>

//             <Form.Group className="mb-3" controlId="address">
//               <Form.Label>Address</Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="Enter your address"
//                 required
//                 value={address}
//                 onChange={(e) => setAddress(e.target.value)}
//                 className="form-control-lg"
//               />
//             </Form.Group>

//             <Form.Group className="mb-3" controlId="phone">
//               <Form.Label>Phone Number</Form.Label>
//               <Form.Control
//                 type="tel"
//                 placeholder="Enter your phone number"
//                 maxLength={10}
//                 pattern="[0-9]{10}"
//                 required
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value)}
//                 className="form-control-lg"
//               />
//             </Form.Group>

//             <Form.Group className="mb-3" controlId="password">
//               <Form.Label>Password</Form.Label>
//               <Form.Control
//                 type="password"
//                 placeholder="Create a password"
//                 required
//                 minLength={6}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="form-control-lg"
//               />
//             </Form.Group>

//             <Form.Group className="mb-3" controlId="confirmPassword">
//               <Form.Label>Confirm Password</Form.Label>
//               <Form.Control
//                 type="password"
//                 placeholder="Confirm your password"
//                 required
//                 minLength={6}
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 className="form-control-lg"
//               />
//             </Form.Group>

//             <Button variant="primary" type="submit" className="w-100 py-2">
//               Sign Up
//             </Button>
//           </Form>

//           <div className="mt-4 text-center">
//             <p>
//               Already have an account?{' '}
//               <Link to={`/signin?redirect=${redirect}`} className="text-decoration-none">
//                 Sign In
//               </Link>
//             </p>
//           </div>
//         </Col>
//       </Row>
//     </Container>
//   );
// }
