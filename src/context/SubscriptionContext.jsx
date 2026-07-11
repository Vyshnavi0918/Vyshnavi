import React, { createContext, useContext } from "react";
import { createSubscription, paySubscription, renewSubscription } from "../services/subscriptionService";

const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const value = {
    createSubscription,
    paySubscription,
    renewSubscription,
  };
  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
};
