import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import { isAuth, isAdmin, mailgun, payOrderEmailTemplate } from '../utils.js';


import Stripe from 'stripe';
const stripe = new Stripe('sk_test_51O6otaSFsGF8VKTobGgjrnHavxhJbPEtCBgwKGrInrhvbIHmVyYHIJfXZw1KVf61p6quGNIFRoCdwWInnoQlQ2gy000C4Xvyoz');



const orderRouter = express.Router();


// In your backend (for example, `stripeController.js` or a relevant controller file)

orderRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find().populate('user', 'name');
    res.send(orders);
  })
);

// orderRouter.post(
//   '/',
//   isAuth,
//   expressAsyncHandler(async (req, res) => {
//     const newOrder = new Order({
//       orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
//       shippingAddress: req.body.shippingAddress,
//       paymentMethod: req.body.paymentMethod,
//       itemsPrice: req.body.itemsPrice,
//       shippingPrice: req.body.shippingPrice,
//       taxPrice: req.body.taxPrice,
//       totalPrice: req.body.totalPrice,
//       user: req.user._id,
//     });

//     const order = await newOrder.save();
//     res.status(201).send({ message: 'New Order Created', order });
//   })
// );

// orderRouter.js (or wherever your /api/orders route is defined)

orderRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
      const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice } = req.body;

      // Create a new Order object
      const newOrder = new Order({
          orderItems: orderItems.map((x) => ({ ...x, product: x._id })),
          shippingAddress,
          paymentMethod,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
          user: req.user._id,
      });

      // Save the order to the database
      const order = await newOrder.save();

      try {
          // Create a Stripe PaymentIntent for this order (amount in cents)
          const paymentIntent = await stripe.paymentIntents.create({
              amount: totalPrice * 100, 
              currency: 'inr', 
              description: `Payment for Order ${order._id}`,
              automatic_payment_methods: { enabled: true }, 

              shipping: {
                name: shippingAddress.fullName, 
                address: {
                    line1: shippingAddress.address,  
                    line2: shippingAddress.address2 || '', 
                    city: shippingAddress.city,
                    state: shippingAddress.state || '', 
                    postal_code: shippingAddress.postalCode,
                    country: shippingAddress.country,
                },
              }
          });

          // Send back the client secret and the order details to the frontend
          res.status(201).send({
              message: 'New Order Created',
              order,
              clientSecret: paymentIntent.client_secret,
          });
          console.log(paymentIntent.client_secret)
      } catch (error) {
          console.error("Error creating PaymentIntent:", error);
          // Handle the error.  You might want to delete the order from the database
          // if the PaymentIntent creation fails.
          res.status(500).send({ message: "Error creating PaymentIntent", error: error.message });
      }
  })
);

orderRouter.get(
  '/summary',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          totalSales: { $sum: '$totalPrice' },
        },
      },
    ]);
    const users = await User.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 },
        },
      },
    ]);
    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          orders: { $sum: 1 },
          sales: { $sum: '$totalPrice' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const productCategories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);
    res.send({ users, orders, dailyOrders, productCategories });
  })
);

orderRouter.get(
  '/mine',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.send(orders);
  })
);

orderRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

orderRouter.put(
  '/:id/deliver',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      await order.save();
      res.send({ message: 'Order Delivered' });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

orderRouter.put(
  '/:id/pay',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'email name'
    );
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      const updatedOrder = await order.save();
      mailgun()
        .messages()
        .send(
          {
            from: 'RAGAVENDHIRA <ragavendira@gmail.com>',
            to: `${order.user.name} <${order.user.email}>`,
            subject: `New order ${order._id}`,
            html: payOrderEmailTemplate(order),
          },
          (error, body) => {
            if (error) {
              console.log(error);
            } else {
              console.log(body);
            }
          }
        );

      res.send({ message: 'Order Paid', order: updatedOrder });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

orderRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      await order.remove();
      res.send({ message: 'Order Deleted' });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);
async function placeOrderHandler() {
  try {
    // Dispatch the 'FETCH_REQUEST' action to indicate that the request is being made
    dispatch({ type: 'FETCH_REQUEST' });

    // Make an HTTP request to create the order
    const { data } = await axios.post('/api/orders', orderData, {
      headers: { authorization: `Bearer ${userInfo.token}` },
    });

    // Dispatch the 'FETCH_SUCCESS' action with the received order data
    dispatch({ type: 'FETCH_SUCCESS', payload: data });

    // Perform any necessary post-order actions (e.g., redirect to order details page)
    navigate(`/order/${data._id}`);
  } catch (error) {
    // Dispatch the 'FETCH_FAIL' action with the error message
    dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
  }
}
export default orderRouter;
