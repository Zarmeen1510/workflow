/* global emailjs */
"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Check, ChevronRight, ArrowLeft, ShieldCheck, Lock, Truck, CreditCard, Bitcoin } from "lucide-react";
import { useCart } from "../context/CartContext";

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const [step, setStep] = useState("shipping");
  const [orderComplete, setOrderComplete] = useState(false);
  const [cryptoError, setCryptoError] = useState("");
  const [cryptoTxHash, setCryptoTxHash] = useState("");
  const [web3, setWeb3] = useState(null);
  const [userAccount, setUserAccount] = useState(null);

  // Form state
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("US");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [saveInfo, setSaveInfo] = useState(false);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 4.99;
  const tax = subtotal * 0.07;
  const total = subtotal + shipping + tax;

  // Initialize Web3 for MetaMask
  useEffect(() => {
    if (window.ethereum && window.Web3) {
      const web3Instance = new window.Web3(window.ethereum);
      setWeb3(web3Instance);
    } else {
      setCryptoError("MetaMask is not installed. Please install it to pay with crypto.");
    }
  }, []);

  // Connect MetaMask wallet
  const connectMetaMask = async () => {
    if (!web3) {
      setCryptoError("Please install MetaMask to pay with Ethereum.");
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setUserAccount(accounts[0]);
      setCryptoError("");
    } catch (error) {
      setCryptoError("Failed to connect MetaMask: " + error.message);
    }
  };

  // Pay with MetaMask (Ethereum)
  const payWithMetaMask = async () => {
    if (!userAccount) {
      setCryptoError("Please connect MetaMask first.");
      return;
    }
    try {
      const merchantAddress = "YOUR_ETHEREUM_WALLET_ADDRESS"; // Replace with your Ethereum wallet (e.g., 0x123...)
      const amountEth = (total / 2000).toFixed(6); // Approx. $2000/ETH, adjust as needed
      const amountWei = web3.utils.toWei(amountEth, "ether");

      const tx = await web3.eth.sendTransaction({
        from: userAccount,
        to: merchantAddress,
        value: amountWei,
      });
      setCryptoTxHash(tx.transactionHash);
      setCryptoError("");
      return tx.transactionHash;
    } catch (error) {
      setCryptoError("Payment failed: " + error.message);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === "shipping") {
      setStep("payment");
    } else if (step === "payment") {
      if (paymentMethod === "crypto") {
        if (cryptoTxHash) {
          setStep("review");
        } else {
          setCryptoError("Please complete the crypto payment.");
        }
      } else {
        setStep("review");
      }
    } else if (step === "review") {
      if (paymentMethod === "crypto" && !cryptoTxHash) {
        setCryptoError("Crypto payment not completed.");
        return;
      }
      setOrderComplete(true);
      clearCart();

      // Send email using EmailJS
      const user = {
        name: `${firstName} ${lastName}`,
        email: email,
      };
      emailjs.send("service_88hvpdg", "template_2je42ji", {
        user_name: user.name,
        user_email: user.email,
      }).then((response) => {
        console.log('Email sent successfully!', response.status, response.text);
      }, (error) => {
        console.error('Failed to send email:', error);
      });
    }
  };

  if (cartItems.length === 0 && !orderComplete) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-8">
          It looks like you haven't added any items to your cart yet.
        </p>
        <Link
          to="/products"
          className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-md"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-gray-500 mb-8">
            Thank you for your purchase. Your order has been confirmed and will be shipped soon.
          </p>
          <div className="bg-white rounded-lg border shadow-sm p-6 mb-8">
            <h2 className="font-semibold mb-4">Order Details</h2>
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Order Number:</span>
              <span className="font-medium">ORD-{Math.floor(100000 + Math.random() * 900000)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Date:</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Total:</span>
              <span className="font-medium">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Payment Method:</span>
              <span>{paymentMethod === "credit-card" ? "Credit Card" : paymentMethod === "crypto" ? "Cryptocurrency" : paymentMethod}</span>
            </div>
            {cryptoTxHash && (
              <div className="flex justify-between">
                <span className="text-gray-500">Transaction Hash:</span>
                <a
                  href={`https://etherscan.io/tx/${cryptoTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600"
                >
                  {cryptoTxHash.slice(0, 6)}...{cryptoTxHash.slice(-4)}
                </a>
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/products" className="flex-1 px-6 py-3 border rounded-md text-center">
              Continue Shopping
            </Link>
            <Link to="/account/orders" className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-md text-center">
              View Order
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Load Web3.js via CDN */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/web3/1.7.4/web3.min.js"></script>
      {/* Load EmailJS SDK via CDN */}
      <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
      <script>
        {`emailjs.init("YOUR_EMAILJS_PUBLIC_KEY");`} // Replace with your EmailJS public key
      </script>
      <div className="flex items-center text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-gray-700">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link to="/cart" className="hover:text-gray-700">
          Cart
        </Link>
        <span className="mx-2">/</span>
        <span>Checkout</span>
      </div>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    step === "shipping" || step === "payment" || step === "review"
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  1
                </div>
                <div className="ml-2">
                  <p className="font-medium">Shipping</p>
                </div>
              </div>
              <div className="w-12 h-0.5 bg-gray-200"></div>
              <div className="flex items-center">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    step === "payment" || step === "review" ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  2
                </div>
                <div className="ml-2">
                  <p className="font-medium">Payment</p>
                </div>
              </div>
              <div className="w-12 h-0.5 bg-gray-200"></div>
              <div className="flex items-center">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    step === "review" ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  3
                </div>
                <div className="ml-2">
                  <p className="font-medium">Review</p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Shipping Step */}
            {step === "shipping" && (
              <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium">
                          Email Address
                        </label>
                        <input
                          id="email"
                          type="email"
                          placeholder="your.email@example.com"
                          className="w-full px-4 py-2 border rounded-md"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="firstName" className="block text-sm font-medium">
                          First Name
                        </label>
                        <input
                          id="firstName"
                          placeholder="John"
                          className="w-full px-4 py-2 border rounded-md"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="lastName" className="block text-sm font-medium">
                          Last Name
                        </label>
                        <input
                          id="lastName"
                          placeholder="Doe"
                          className="w-full px-4 py-2 border rounded-md"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="address" className="block text-sm font-medium">
                        Street Address
                      </label>
                      <input
                        id="address"
                        placeholder="123 Main St"
                        className="w-full px-4 py-2 border rounded-md"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="city" className="block text-sm font-medium">
                          City
                        </label>
                        <input
                          id="city"
                          placeholder="New York"
                          className="w-full px-4 py-2 border rounded-md"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="state" className="block text-sm font-medium">
                          State / Province
                        </label>
                        <select
                          id="state"
                          className="w-full px-4 py-2 border rounded-md"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          required
                        >
                          <option value="">Select state</option>
                          <option value="AL">Alabama</option>
                          <option value="AK">Alaska</option>
                          <option value="AZ">Arizona</option>
                          <option value="CA">California</option>
                          <option value="CO">Colorado</option>
                          <option value="NY">New York</option>
                          <option value="TX">Texas</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="zipCode" className="block text-sm font-medium">
                          ZIP / Postal Code
                        </label>
                        <input
                          id="zipCode"
                          placeholder="10001"
                          className="w-full px-4 py-2 border rounded-md"
                          value={zipCode}
                          onChange={(e) => setZipCode(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="country" className="block text-sm font-medium">
                          Country
                        </label>
                        <select
                          id="country"
                          className="w-full px-4 py-2 border rounded-md"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          required
                        >
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="UK">United Kingdom</option>
                          <option value="AU">Australia</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="block text-sm font-medium">
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        placeholder="(123) 456-7890"
                        className="w-full px-4 py-2 border rounded-md"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex items-center space-x-2 pt-2">
                      <input
                        id="saveInfo"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300"
                        checked={saveInfo}
                        onChange={(e) => setSaveInfo(e.target.checked)}
                      />
                      <label htmlFor="saveInfo" className="text-sm">
                        Save this information for next time
                      </label>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-6 border-t flex justify-between">
                  <Link to="/cart" className="px-4 py-2 border rounded-md flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Cart
                  </Link>
                  <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-md flex items-center">
                    Continue to Payment
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </button>
                </div>
              </div>
            )}

            {/* Payment Step */}
            {step === "payment" && (
              <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
                  {cryptoError && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{cryptoError}</div>
                  )}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 border rounded-lg p-4">
                      <input
                        type="radio"
                        id="credit-card"
                        name="payment-method"
                        value="credit-card"
                        checked={paymentMethod === "credit-card"}
                        onChange={() => setPaymentMethod("credit-card")}
                        className="h-4 w-4"
                      />
                      <label htmlFor="credit-card" className="flex-1 flex items-center cursor-pointer">
                        <CreditCard className="h-5 w-5 mr-2" />
                        Credit / Debit Card
                      </label>
                      <div className="flex items-center space-x-1">
                        <div className="  bg-gray-100 rounded flex items-center justify-center">
                          <img src="https://cart-mart.netlify.app/img/pay/pay.png" alt="Visa" className="" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-lg p-4">
                      <input
                        type="radio"
                        id="paypal"
                        name="payment-method"
                        value="paypal"
                        checked={paymentMethod === "paypal"}
                        onChange={() => setPaymentMethod("paypal")}
                        className="h-4 w-4"
                      />
                      <label htmlFor="paypal" className="flex-1 flex items-center cursor-pointer">
                        <div className="h-5 w-10 mr-2 flex items-center justify-center">
                          <img src="https://pngimg.com/uploads/paypal/paypal_PNG7.png" alt="PayPal" className="h-5" />
                        </div>
                        PayPal
                      </label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-lg p-4">
                      <input
                        type="radio"
                        id="apple-pay"
                        name="payment-method"
                        value="apple-pay"
                        checked={paymentMethod === "apple-pay"}
                        onChange={() => setPaymentMethod("apple-pay")}
                        className="h-4 w-4"
                      />
                      <label htmlFor="apple-pay" className="flex-1 flex items-center cursor-pointer">
                        <div className="h-5 w-10 mr-2 flex items-center justify-center">
                          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Apple_Pay_logo.svg/512px-Apple_Pay_logo.svg.png" alt="Apple Pay" className="h-5" />
                        </div>
                        Apple Pay
                      </label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-lg p-4">
                      <input
                        type="radio"
                        id="crypto"
                        name="payment-method"
                        value="crypto"
                        checked={paymentMethod === "crypto"}
                        onChange={() => setPaymentMethod("crypto")}
                        className="h-4 w-4"
                      />
                      <label htmlFor="crypto" className="flex-1 flex items-center cursor-pointer">
                        <Bitcoin className="h-5 w-5 mr-2" />
                        Cryptocurrency
                      </label>
                    </div>
                    {paymentMethod === "crypto" && (
                      <div className="mt-6 space-y-4">
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Pay with Ethereum via MetaMask</p>
                          <div className="flex gap-4">
                            <button
                              type="button"
                              onClick={connectMetaMask}
                              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400"
                              disabled={userAccount}
                            >
                              {userAccount ? `Connected: ${userAccount.slice(0, 6)}...` : "Connect MetaMask"}
                            </button>
                            <button
                              type="button"
                              onClick={payWithMetaMask}
                              className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-md disabled:bg-gray-400"
                              disabled={!userAccount || cryptoTxHash}
                            >
                              Pay {total.toFixed(2)} USD (~{(total / 2000).toFixed(6)} ETH)
                            </button>
                          </div>
                          {cryptoTxHash && (
                            <p className="text-sm text-green-600">
                              Transaction successful! TX Hash:{" "}
                              <a
                                href={`https://etherscan.io/tx/${cryptoTxHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600"
                              >
                                {cryptoTxHash.slice(0, 6)}...{cryptoTxHash.slice(-4)}
                              </a>
                            </p>
                          )}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-2">
                          <Lock className="h-4 w-4 mr-2" />
                          Crypto payments are secure and processed on the blockchain
                        </div>
                      </div>
                    )}
                    {paymentMethod === "credit-card" && (
                      <div className="mt-6 space-y-4">
                        <div className="space-y-2">
                          <label htmlFor="cardName" className="block text-sm font-medium">
                            Name on Card
                          </label>
                          <input id="cardName" placeholder="John Doe" className="w-full px-4 py-2 border rounded-md" />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="cardNumber" className="block text-sm font-medium">
                            Card Number
                          </label>
                          <input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            className="w-full px-4 py-2 border rounded-md"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label htmlFor="cardExpiry" className="block text-sm font-medium">
                              Expiration Date
                            </label>
                            <input id="cardExpiry" placeholder="MM/YY" className="w-full px-4 py-2 border rounded-md" />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="cardCvc" className="block text-sm font-medium">
                              CVC
                            </label>
                            <input id="cardCvc" placeholder="123" className="w-full px-4 py-2 border rounded-md" />
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-2">
                          <Lock className="h-4 w-4 mr-2" />
                          Your payment information is secure and encrypted
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 p-6 border-t flex justify-between">
                  <button
                    type="button"
                    className="px-4 py-2 border rounded-md flex items-center"
                    onClick={() => setStep("shipping")}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Shipping
                  </button>
                  <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-md flex items-center">
                    Continue to Review
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </button>
                </div>
              </div>
            )}

            {/* Review Step */}
            {step === "review" && (
              <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Review Your Order</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">Shipping Information</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="mb-1">
                          <span className="font-medium">
                            {firstName} {lastName}
                          </span>
                        </p>
                        <p className="text-gray-500">
                          {address}
                          <br />
                          {city}, {state} {zipCode}
                          <br />
                          {country === "US" ? "United States" : country}
                          <br />
                          {phone}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="text-sm text-emerald-600 mt-2"
                        onClick={() => setStep("shipping")}
                      >
                        Edit
                      </button>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Payment Method</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        {paymentMethod === "credit-card" && (
                          <div className="flex items-center">
                            <CreditCard className="h-5 w-5 mr-2" />
                            <div>
                              <p className="font-medium">Credit Card</p>
                              <p className="text-gray-500">**** **** **** 1234</p>
                            </div>
                          </div>
                        )}
                        {paymentMethod === "paypal" && (
                          <div className="flex items-center">
                            <div className="h-5 w-5 mr-2 flex items-center justify-center">
                              <img src="https://via.placeholder.com/20x20?text=PP" alt="PayPal" className="h-5" />
                            </div>
                            <p className="font-medium">PayPal</p>
                          </div>
                        )}
                        {paymentMethod === "apple-pay" && (
                          <div className="flex items-center">
                            <div className="h-5 w-5 mr-2 flex items-center justify-center">
                              <img src="https://via.placeholder.com/20x20?text=AP" alt="Apple Pay" className="h-5" />
                            </div>
                            <p className="font-medium">Apple Pay</p>
                          </div>
                        )}
                        {paymentMethod === "crypto" && (
                          <div className="flex items-center">
                            <Bitcoin className="h-5 w-5 mr-2" />
                            <div>
                              <p className="font-medium">Cryptocurrency</p>
                              <p className="text-gray-500">Paid with Ethereum</p>
                            </div>
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        className="text-sm text-emerald-600 mt-2"
                        onClick={() => setStep("payment")}
                      >
                        Edit
                      </button>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Order Items</h3>
                      <div className="space-y-4">
                        {cartItems.map((item) => (
                          <div
                            key={`${item.id}-${item.color}-${item.size}`}
                            className="flex items-center gap-4"
                          >
                            <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                              <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-500">
                                {item.color} • {item.size} • Qty: {item.quantity}
                              </p>
                            </div>
                            <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-6 border-t flex justify-between">
                  <button
                    type="button"
                    className="px-4 py-2 border rounded-md flex items-center"
                    onClick={() => setStep("payment")}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Payment
                  </button>
                  <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-md flex items-center">
                    Place Order
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:w-96">
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden sticky top-8">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tax (7%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-6 border-t">
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 mr-2" />
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center text-sm">
                  <Truck className="h-4 w-4 text-emerald-600 mr-2" />
                  <span>Free shipping on orders over $100</span>
                </div>
                <div className="flex items-center text-sm">
                  <CreditCard className="h-4 w-4 text-emerald-600 mr-2" />
                  <span>Multiple payment options</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;