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

// export default function SigninScreen() {
//   const navigate = useNavigate();
//   const { search } = useLocation();
//   const redirectInUrl = new URLSearchParams(search).get('redirect');
//   const redirect = redirectInUrl ? redirectInUrl : '/';

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const { state, dispatch: ctxDispatch } = useContext(Store);
//   const { userInfo } = state;
//   const submitHandler = async (e) => {
//     e.preventDefault();
//     try {
//       const { data } = await Axios.post('/api/users/signin', {
//         email,
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
//     <Container className="small-container">
//       <Helmet>
//         <title>Sign In</title>
//       </Helmet>
//       <h1 className="my-3">Sign In</h1>
//       <Form onSubmit={submitHandler}>
//         <Form.Group className="mb-3" controlId="email">
//           <Form.Label>Email</Form.Label>
//           <Form.Control
//             type="email"
//             required
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </Form.Group>
//         <Form.Group className="mb-3" controlId="password">
//           <Form.Label>Password</Form.Label>
//           <Form.Control
//             type="password"
//             required
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </Form.Group>
//         <div className="mb-3">
//           <Button type="submit">Sign In</Button>
//         </div>
//         <div className="mb-3">
//           New customer?{' '}
//           <Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
//         </div>
//         <div className="mb-3">
//           Forget Password? <Link to={`/forget-password`}>Reset Password</Link>
//         </div>
//       </Form>
//     </Container>
//   );
// }


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
import { Row, Col } from 'react-bootstrap';

export default function SigninScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await Axios.post('/api/users/signin', {
        email,
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
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <Row className="w-100">
        <Col sm={12} md={8} lg={6} className="mx-auto bg-light p-4 rounded shadow-lg">
          <h1 className="text-center mb-4">Sign In</h1>
          <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control-lg"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control-lg"
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 py-2">
              Sign In
            </Button>
          </Form>

          <div className="mt-4 text-center">
            <p>
              New to our platform?{' '}
              <Link to={`/signup?redirect=${redirect}`} className="text-decoration-none">
                Create an account
              </Link>
            </p>
            <p>
              <Link to={`/forget-password`} className="text-decoration-none">
                Forgot your password?
              </Link>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

