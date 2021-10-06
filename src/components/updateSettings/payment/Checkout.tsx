import React, { useState, useEffect, FormEvent, useCallback, useRef } from 'react';
import classes from './Checkout.module.scss';
import ErrorPage from '../../ErrorPage/ErrorPage';
import { PackageOption, Payment, UserInfo } from '../../../models';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import {
  StripeCardElement,
  StripeCardElementChangeEvent,
  PaymentMethodCreateParams,
} from '@stripe/stripe-js';
import { Spinner, Alert } from 'reactstrap';
import { useParams, useHistory } from 'react-router';
import { poster, getter, expander } from '../../../utilities';

interface CheckoutProps {
  userInfo: UserInfo;
}

interface ParamsType {
  quantity: string;
  packageId: string;
}

const Checkout: React.FC<CheckoutProps> = (props) => {
  const token = props.userInfo.token;
  const params = useParams<ParamsType>();
  const history = useHistory();

  const [isError, setIsError] = useState<boolean>(false);
  const [errMessage, setErrMessage] = useState<string>('');
  const [selectedPackage, setSelectedPackage] = useState<PackageOption>();
  const [cardHoldersName, setCardHoldersName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [stAddress, setStAddress] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [zip, setZip] = useState<string>('');
  const [clientSecret, setClientSecret] = useState<string>('');
  const [chargeAmount, setChargeAmount] = useState<number>(0);
  const [disabled, setDisabled] = useState<boolean>(true);
  const [processing, setProcessing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMain, setLoadingMain] = useState<boolean>(true);
  const [large, setLarge] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const responseDivRef = useRef<HTMLDivElement>(null);
  const stripe = useStripe()!;
  const elements = useElements();

  const CardElementOptions = {
    hidePostalCode: true,

    style: {
      base: {
        fontSize: '16px',
        color: '#f8f7e7',
        backgroundColor: '#222222',
        '::placeholder': {
          color: '#f8f7e7a6',
        },
      },
      invalid: {
        fontSize: '16px',
        color: '#be2828',
        backgroundColor: '#222222',
      },
    },
  };

  const loadUpHandler = useCallback(async () => {
    try {
      const data = await poster(token, 'payments/createPaymentIntent', {
        quantity: +params.quantity,
        packageId: params.packageId,
      });
      setClientSecret(data.paymentIntent.client_secret);
      setChargeAmount(data.paymentIntent.amount);
      const packageData = await getter(token, 'payments/getPackages', `id=${params.packageId}`);
      setSelectedPackage(packageData.packages[0]);
    } catch (error: any) {
      console.log(error);
      setIsError(true);
      if (
        error.response !== undefined &&
        error.response.data !== undefined &&
        error.response.data.message !== undefined
      ) {
        setErrMessage(error.response.data.message);
      } else {
        setErrMessage('No charge has been made. Problem fetching your data. Please let site admin Know.');
      }
    } finally {
      setLoadingMain(false);
    }
  }, [params.packageId, params.quantity, token]);

  const paymentSubmitHandler = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setProcessing(true);
    setLoading(true);
    if (responseDivRef.current !== null) {
      expander(responseDivRef.current!, true);
    }
    try {
      if (!clientSecret) {
        throw new Error('Server Error');
      }
      const billingDetails: PaymentMethodCreateParams.BillingDetails = {
        name: cardHoldersName,
        email: email,
        address: {
          city: city,
          line1: stAddress,
          state: state,
          postal_code: zip,
        },
      };
      const cardElement: StripeCardElement = elements!.getElement(CardElement)!;
      const payment = await stripe!.confirmCardPayment(clientSecret, {
        receipt_email: email,
        payment_method: {
          card: cardElement,
          billing_details: billingDetails,
        },
      });
      if (payment.error) {
        throw new Error(payment.error.message);
      }
      let info: Payment = {
        userId: props.userInfo.user.id!,
        cardHoldersName: cardHoldersName,
        email,
        chargeAmount: payment.paymentIntent!.amount,
        purchaseQuantity: +params.quantity,
        chargeDate: new Date(payment.paymentIntent!.created * 1000).toLocaleString(),
        numberOfLessons: selectedPackage!.numberOfLessons,
        itemTitle: selectedPackage!.title,
      };
      const data = await poster(token, 'payments/savePayment', info);
      history.push(`/success/${data.receipt.id}`);
    } catch (error: any) {
      console.log(error);
      if (
        error.response !== undefined &&
        error.response.data !== undefined &&
        error.response.data.message !== undefined
      ) {
        setError(error.response.data.message);
      } else {
        setError(error.message);
      }
      setProcessing(false);
      setTimeout(() => {
        setError('');
      }, 5500);
    } finally {
      setLoading(false);
      setTimeout(() => {
        if (responseDivRef.current !== null) {
          expander(responseDivRef.current!, false);
        }
      }, 5000);
    }
  };

  const onCardChange = (e: StripeCardElementChangeEvent) => {
    setDisabled(e.empty);
  };

  const resizeHandler = () => {
    if (window.innerWidth >= 700) {
      setLarge(true);
    }
    if (window.innerWidth < 700) {
      setLarge(false);
    }
  };

  window.addEventListener('resize', resizeHandler);

  useEffect(() => {
    loadUpHandler();
    if (window.innerWidth >= 700) {
      setLarge(true);
    }
  }, [loadUpHandler]);

  if (isError) {
    return <ErrorPage errMessage={errMessage} />;
  } else if (loadingMain) {
    return (
      <div className={`${classes.loadingMain} ${classes.wrapper}`}>
        <Spinner className={classes.spinner}></Spinner>
      </div>
    );
  } else {
    return (
      <div className={classes.wrapper}>
        <h3>Make a payment</h3>
        <div className={classes.checkoutContainer}>
          <h5>Payment Information</h5>
          <form className={classes.form} onSubmit={paymentSubmitHandler}>
            <div className={classes.formGroup}>
              <label htmlFor="name">Name</label>
              <input
                required
                type="text"
                name="name"
                placeholder="Ringo Starr"
                onChange={(e) => setCardHoldersName(e.target.value.trim())}
              ></input>
            </div>
            <div className={classes.formGroup}>
              <label htmlFor="Email">Email</label>
              <input
                required
                type="text"
                name="Email"
                onChange={(e) => setEmail(e.target.value.trim())}
              ></input>
            </div>
            <div className={classes.formGroup}>
              <label htmlFor="Address">Address</label>
              <input
                required
                type="text"
                name="Address"
                onChange={(e) => setStAddress(e.target.value.trim())}
              ></input>
            </div>
            <div className={classes.formGroup}>
              <label htmlFor="City">City</label>
              <input
                required
                type="text"
                name="City"
                onChange={(e) => setCity(e.target.value.trim())}
              ></input>
            </div>
            <div className={classes.formGroup}>
              <label htmlFor="State">State</label>
              <input
                required
                type="text"
                name="State"
                onChange={(e) => setState(e.target.value.trim())}
              ></input>
            </div>
            <div className={classes.formGroup}>
              <label htmlFor="zip">ZIP</label>
              <input required type="text" name="zip" onChange={(e) => setZip(e.target.value.trim())}></input>
            </div>
            <div className={classes.formGroup}>
              <p className={classes.cardInfoLabel}>Card Info</p>
              <div className={`${classes.formGroup} ${classes.cardElementContainer}`}>
                <CardElement options={CardElementOptions} onChange={(e) => onCardChange(e)} />
              </div>
            </div>
            <button className={classes.submitButton} type="submit" disabled={processing || disabled}>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
              }).format(chargeAmount / 100)}
            </button>
            {loading ? <Spinner></Spinner> : <></>}
            {error ? <Alert>{error}</Alert> : <></>}
          </form>
        </div>
        {large ? (
          <div className={classes.sideImg}>
            <div className={classes.responseDiv} ref={responseDivRef}>
              {loading ? <Spinner className={classes.spinner}></Spinner> : <></>}
              {error ? <p className={classes.alert}>{error}</p> : <></>}
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  }
};

export default Checkout;
