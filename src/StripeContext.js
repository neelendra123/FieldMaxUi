// StripeContext.js
import React, { createContext, useContext, useMemo } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const StripeContext = createContext();

export const useStripe = () => useContext(StripeContext);

export const StripeProvider = ({ children }) => {
  const stripePromise = useMemo(() => loadStripe('pk_test_51Ntr3mKzQTtThOx7LzV18xTzDCNh5etRmHrCPPZSoUwk7y2uZitPv90qEbp7s5ralhSLND4XyhrxRhF73VLUENb900HOtlurY3'), []);

  return (
    <StripeContext.Provider value={stripePromise}>
      {children}
    </StripeContext.Provider>
  );
};
