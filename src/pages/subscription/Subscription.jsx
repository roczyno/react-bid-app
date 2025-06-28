import { useEffect, useState } from "react";
import "./subscription.scss";
import { userRequest } from "../../requestMethods";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Subscription = () => {
  const user = useSelector((state) => state.user.currentUser);
  const [currentSubscription, setCurrentSubscription] = useState("BASIC");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    const getUserSubscription = async () => {
      try {
        const res = await userRequest.get(`/subscription/${user.user.id}`);
        setCurrentSubscription(res.data.content.planType);
      } catch (error) {
        console.log(error);
      }
    };
    getUserSubscription();
  }, [user.user.id]);

  useEffect(() => {
    // Listen to payment status changes if your payment provider supports webhooks or redirects
    const handlePaymentStatus = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const trxref = queryParams.get("trxref");
      const reference = queryParams.get("reference");
      console.log("trxref:", trxref); // Debug logging
      console.log("reference:", reference);

      if (trxref && reference) {
        const newPlanType = localStorage.getItem("newPlanType");
        await verifyPaymentAndUpgrade(reference, newPlanType);
      }
    };

    handlePaymentStatus();
  }, []);

  const handleSubscriptionChange = async (planType) => {
    if (planType === currentSubscription) return;
    setIsProcessingPayment(true);
    localStorage.setItem("newPlanType", planType); // Save the planType in local storage

    try {
      // Initialize payment
      const paymentRequest = {
        email: user.user.email,
        amount: planType === "STANDARD" ? "50000" : "100000",
      };

      const paymentResponse = await userRequest.post(
        "/payment/initialize",
        paymentRequest
      );

      window.location.href = paymentResponse.data.data.authorization_url;
    } catch (error) {
      console.log(error);
      toast.error("Payment initialization failed.");
      setIsProcessingPayment(false);
    }
  };

  const verifyPaymentAndUpgrade = async (reference, newPlanType) => {
    if (!newPlanType) {
      console.error("newPlanType is null. Skipping upgrade process.");
      return;
    }
    try {
      const res = await userRequest.post("/payment/verify", { reference });
      toast.success(res.data);
      setIsProcessingPayment(false);

      // Update subscription state after successful verification
      const subscriptionRes = await userRequest.put(
        `/subscription/${user.user.id}/upgrade?planType=${newPlanType}`
      );

      setCurrentSubscription(subscriptionRes.data.content.planType);
      localStorage.removeItem("newPlanType"); // Clear the saved planType from local storage
    } catch (error) {
      console.log(error);
      toast.error("Payment verification failed.");
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="subscriptions">
      <ToastContainer />
      <h5>Pricing</h5>
      <h1>Transparent Pricing, Exceptional Value</h1>
      <p>
        Choose from our flexible pricing options designed to fit your needs and
        budget. We offer straightforward pricing with no hidden fees
      </p>

      <div className="subscription">
        <div
          className={currentSubscription === "BASIC" ? "item active" : "item"}
        >
          <div className="wrapper">
            <div className="top">
              <span className="sub_title">Basic Plan</span>
              <span className="sub_desc">Perfect For you</span>
              <span className="sub_amount">$20/month</span>
            </div>

            <div className="content">
              <span className="content_title">You will get:</span>
              <span>-Access to all auctions</span>
              <span>-Create one auction</span>
              <span>-Bid on one Auction</span>
              <span>-No Security</span>
            </div>
            <button
              disabled={isProcessingPayment}
              onClick={() => handleSubscriptionChange("BASIC")}
            >
              {currentSubscription === "BASIC"
                ? "Current Plan"
                : "Choose this plan"}
            </button>
          </div>
        </div>
        <div
          className={
            currentSubscription === "STANDARD" ? "item active" : "item"
          }
        >
          <div className="wrapper">
            <div className="top">
              <span className="sub_title">Standard Plan</span>
              <span className="sub_desc">Perfect For you</span>
              <span className="sub_amount">$50/month</span>
            </div>

            <div className="content">
              <span className="content_title">You will get:</span>
              <span>-Access to all auctions</span>
              <span>-Create five auctions</span>
              <span>-Bid on five Auctions</span>
              <span>-Security</span>
            </div>
            <button
              disabled={isProcessingPayment}
              onClick={() => handleSubscriptionChange("STANDARD")}
            >
              {currentSubscription === "STANDARD"
                ? "Current Plan"
                : "Choose this plan"}
            </button>
          </div>
        </div>
        <div
          className={currentSubscription === "PREMIUM" ? "item active" : "item"}
        >
          <div className="wrapper">
            <div className="top">
              <span className="sub_title">Premium Plan</span>
              <span className="sub_desc">Perfect For you</span>
              <span className="sub_amount">$100/month</span>
            </div>

            <div className="content">
              <span className="content_title">You will get:</span>
              <span>-Access to all auctions</span>
              <span>-Create unlimited auctions</span>
              <span>-Make unlimited bids</span>
              <span>-Advanced Security</span>
            </div>
            <button
              disabled={isProcessingPayment}
              onClick={() => handleSubscriptionChange("PREMIUM")}
            >
              {currentSubscription === "PREMIUM"
                ? "Current Plan"
                : "Choose this plan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
