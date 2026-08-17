import React, { useEffect, useContext } from 'react'
import axios from 'axios'
import './Verify.css'
import { StoreContext } from '../../context/StoreContext'
import { useSearchParams, useNavigate } from 'react-router-dom'

const Verify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { url, token } = useContext(StoreContext);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const success = searchParams.get('success');
        const orderId = searchParams.get('orderId');

        const response = await axios.post(
          url + "/api/order/verify",
          {
            success: success,
            orderId: orderId
          },
          {
            headers: { token }
          }
        );

        if (response.data.success) {
          // Payment successful - redirect after 3 seconds
          setTimeout(() => {
            navigate('/');
          }, 3000);
        } else {
          // Payment failed
          setTimeout(() => {
            navigate('/');
          }, 3000);
        }
      } catch (error) {
        console.error("Verification error:", error);
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    };

    if (token) {
      verifyPayment();
    } else {
      navigate('/');
    }
  }, [searchParams, url, token, navigate]);

  return (
    <div className='verify'>
      <div className='spinner'></div>
      <div className='message'>
        <p>Processing your payment...</p>
        <p style={{ fontSize: '14px', marginTop: '10px', color: '#999' }}>
          Please wait, verifying your order.
        </p>
      </div>
    </div>
  )
}

export default Verify
