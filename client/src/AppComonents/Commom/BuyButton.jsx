// client/src/AppComonents/Commom/BuyButton.jsx
import { Button } from '../../components/ui/button.jsx';
import { 
  useCreateRazorpayOrderMutation, 
  useVerifyRazorpayPaymentMutation 
} from '../../Features/Apis/purcaseApi.js';
import { Loader2Icon } from 'lucide-react';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';

const BuyButton = ({ courseId, coursePrice, courseTitle }) => {
  const [createRazorpayOrder, { isLoading: creatingOrder }] = useCreateRazorpayOrderMutation();
  const [verifyRazorpayPayment, { isLoading: verifyingPayment }] = useVerifyRazorpayPaymentMutation();
  
  const { user } = useSelector((state) => state.auth);
  
  const isLoading = creatingOrder || verifyingPayment;

  // Load Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const purchaseCourseHandler = async () => {
    try {
      // Load Razorpay script
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        toast.error('Razorpay SDK failed to load. Please try again.', {
          className: "custom-toast",
        });
        return;
      }

      // Create Razorpay order
      const orderResponse = await createRazorpayOrder(courseId).unwrap();
      
      if (!orderResponse.success) {
        toast.error(orderResponse.message || 'Failed to create order', {
          className: "custom-toast",
        });
        return;
      }

      const { order, key } = orderResponse;

      // Razorpay options
      const options = {
        key: key,
        amount: order.amount,
        currency: order.currency,
        name: "Learnify", // Change to your platform name
        description: courseTitle || `Course Purchase`,
        order_id: order.id,
        handler: async function (response) {
          try {
            // Verify payment
            const verificationResponse = await verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              courseId: courseId
            }).unwrap();

            if (verificationResponse.success) {
              toast.success('Payment Successful! Redirecting to course...', {
                className: "custom-toast",
              });
              
              // Redirect to course progress page after successful payment
              setTimeout(() => {
                window.location.href = `/course-progress/${courseId}`;
              }, 2000);
            } else {
              toast.error('Payment verification failed. Please contact support.', {
                className: "custom-toast",
              });
            }
          } catch (verificationError) {
            console.error('Payment verification error:', verificationError);
            toast.error('Payment verification failed. Please contact support.', {
              className: "custom-toast",
            });
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || ''
        },
        theme: {
          color: '#3399cc'
        },
        modal: {
          ondismiss: function() {
            toast.info('Payment cancelled', {
              className: "custom-toast",
            });
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error?.data?.message || 'Payment failed. Please try again.', {
        className: "custom-toast",
      });
    }
  };

  return (
    <Button 
      disabled={isLoading} 
      className="w-full"
      onClick={purchaseCourseHandler}
    >
      {isLoading ? (
        <>
          <Loader2Icon className='mr-2 h-4 w-4 animate-spin' />
          {verifyingPayment ? 'Verifying...' : 'Processing...'}
        </>
      ) : (
        `Buy Now - ₹${coursePrice || ''}`
      )}
    </Button>
  );
}

export default BuyButton;