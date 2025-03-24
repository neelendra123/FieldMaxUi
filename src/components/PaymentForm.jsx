import {ElementsConsumer, PaymentElement, LinkAuthenticationElement,ExpressCheckoutElement, FpxBankElement} from '@stripe/react-stripe-js';
import React from 'react';
class CheckoutForm extends React.Component {
  
  handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    const {stripe, elements} = this.props;
    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const result = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: "https://example.com/order/123/complete",
      },
    });

    if (result.error) {
      // Show error to your customer (for example, payment details incomplete)
      console.log(result.error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };

  render() {
    const { name, email } = this.props;
    // const paymentElementOptions = {
    //   layout: "tabs"
    // }
    console.log(name, email);
    return (
        <form onSubmit={this.handleSubmit}>
          {/* Pass the custom styling to the PaymentElement */}
          {/* <PaymentElement id="payment-element" options={paymentElementOptions} /> */}
          {/* <FpxBankElement/> */}
          <PaymentElement 
          options={{
            defaultValues: {
              billingDetails: {
                name: name,
                email: email,
              },
            },
          }}
          />
          <button style={{
            backgroundColor: '#4FD44C',
            color: '#FFFFFF',
            border: 'none',
            fontFamily: 'Lato',
            borderRadius: '4px',
            marginLeft: '10px', // Add space between buttons
            padding:10,
            width:450
          }}>Submit</button>
        </form>
      );
  }
}
  // export default CheckoutForm
export default function InjectedCheckoutForm() {
 
    return (
      <ElementsConsumer >
        {({ stripe, elements, name, email}) => (     
          <CheckoutForm stripe={stripe} elements={elements} name={"Tony Dipiazza"} email={"tony@generalhomecorp.com"}/>
        )}
      </ElementsConsumer>
    );
  }