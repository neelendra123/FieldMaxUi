import React from 'react'
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from './PaymentForm';
const stripePromise = loadStripe("pk_test_51Ntr3mKzQTtThOx7LzV18xTzDCNh5etRmHrCPPZSoUwk7y2uZitPv90qEbp7s5ralhSLND4XyhrxRhF73VLUENb900HOtlurY3")
const stripe = Stripe('pk_test_51Ntr3mKzQTtThOx7LzV18xTzDCNh5etRmHrCPPZSoUwk7y2uZitPv90qEbp7s5ralhSLND4XyhrxRhF73VLUENb900HOtlurY3');

function Stripe({ showstripeintent, email, name }) {
      const appearance = {
        theme: 'stripe',
      };
      const options = {
        // passing the client secret obtained from the server
        clientSecret: showstripeintent,
        appearance,
      };
      
      //const appearance = { /* appearance */ };
      // const options = { mode: 'shipping' };
      // const elements = stripe.elements({ showstripeintent });
      // const linkAuthElement = elements.create('linkAuthentication');
      // const addressElement = elements.create('address', options);
      // const paymentElement = elements.create('payment');
      // linkAuthElement.mount('#link-auth-element');
      // addressElement.mount('#address-element');
      // paymentElement.mount('#payment-element');

      return (
        <Elements stripe={stripePromise} options={options} name={name} email={email}>
          <PaymentForm name={name} email={email}/>
        </Elements>
      );
}
//https://stripe.com/docs/payments/quickstart
export default Stripe