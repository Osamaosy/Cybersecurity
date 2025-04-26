import React, { useState } from 'react';
import { X, CreditCard, User, Calendar, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { Course, PaymentInfo } from '../types';

interface PaymentModalProps {
  course: Course;
  onClose: () => void;
  onPaymentComplete: (courseId: string) => void;
}

export default function PaymentModal({ course, onClose, onPaymentComplete }: PaymentModalProps) {
  const [step, setStep] = useState<'details' | 'processing' | 'success' | 'error'>('details');
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setPaymentInfo({ ...paymentInfo, [name]: formatted });
      return;
    }
    
    // Format expiry date with slash
    if (name === 'expiryDate') {
      let formatted = value.replace(/\//g, '');
      if (formatted.length > 2) {
        formatted = `${formatted.substring(0, 2)}/${formatted.substring(2, 4)}`;
      }
      setPaymentInfo({ ...paymentInfo, [name]: formatted });
      return;
    }
    
    setPaymentInfo({ ...paymentInfo, [name]: value });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate card number (16 digits)
    const cardNumberDigits = paymentInfo.cardNumber.replace(/\s/g, '');
    if (!/^\d{16}$/.test(cardNumberDigits)) {
      newErrors.cardNumber = 'The card number must consist of 16 digits.';
    }
    
    // Validate card holder
    if (!paymentInfo.cardHolder.trim()) {
      newErrors.cardHolder = 'Please enter cardholder name';
    }
    
    // Validate expiry date (MM/YY format)
    if (!/^\d{2}\/\d{2}$/.test(paymentInfo.expiryDate)) {
      newErrors.expiryDate = 'Please enter a valid expiration date. (MM/YY)';
    } else {
      const [month, year] = paymentInfo.expiryDate.split('/').map(Number);
      const now = new Date();
      const currentYear = now.getFullYear() % 100;
      const currentMonth = now.getMonth() + 1;
      
      if (month < 1 || month > 12) {
        newErrors.expiryDate = 'Invalid month';
      } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
        newErrors.expiryDate = 'Expired card';
      }
    }
    
    // Validate CVV (3 digits)
    if (!/^\d{3}$/.test(paymentInfo.cvv)) {
      newErrors.cvv = 'CVV code must consist of 3 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setStep('processing');
      
      try {
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Call onPaymentComplete and check the result
        onPaymentComplete(course.id);
        setStep('success');
      } catch (error) {
        console.error('Payment error:', error);
        setErrorMessage('An error occurred while processing your payment. Please try again.');
        setStep('error');
      }
    }
  };

  const handleComplete = () => {
    onClose();
  };

  const handleRetry = () => {
    setStep('details');
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-primary-600 text-white px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-bold">
            {step === 'details' && 'Complete the purchase'}
            {step === 'processing' && 'Payment is being processed'}
            {step === 'success' && 'Purchase successfully'}
            {step === 'error' && 'Payment error'}
          </h3>
          {step !== 'processing' && (
            <button 
              onClick={onClose}
              className="text-white hover:text-primary-100 transition"
            >
              <X className="h-6 w-6" />
            </button>
          )}
        </div>
        
        {/* Content */}
        <div className="p-6">
          {step === 'details' && (
            <>
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-2">Course details</h4>
                <div className="flex items-start">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-20 h-20 object-cover rounded-md ml-4"
                  />
                  <div>
                    <h5 className="font-medium text-gray-900">{course.title}</h5>
                    <p className="text-sm text-gray-600 mb-1">{course.instructor}</p>
                    <p className="text-primary-600 font-bold">${course.price}</p>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleSubmit}>
                <h4 className="text-lg font-bold text-gray-900 mb-4">Payment information</h4>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Card number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <CreditCard className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="cardNumber"
                        name="cardNumber"
                        type="text"
                        maxLength={19}
                        value={paymentInfo.cardNumber}
                        onChange={handleChange}
                        placeholder="0000 0000 0000 0000"
                        className={`appearance-none block w-full px-3 py-3 pr-10 border ${
                          errors.cardNumber ? 'border-red-300' : 'border-gray-300'
                        } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                      />
                    </div>
                    {errors.cardNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700 mb-1">
                    Cardholder's Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="cardHolder"
                        name="cardHolder"
                        type="text"
                        value={paymentInfo.cardHolder}
                        onChange={handleChange}
                        placeholder="Name as it appears on the card"
                        className={`appearance-none block w-full px-3 py-3 pr-10 border ${
                          errors.cardHolder ? 'border-red-300' : 'border-gray-300'
                        } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                      />
                    </div>
                    {errors.cardHolder && (
                      <p className="mt-1 text-sm text-red-600">{errors.cardHolder}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Expiration date
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="expiryDate"
                          name="expiryDate"
                          type="text"
                          maxLength={5}
                          value={paymentInfo.expiryDate}
                          onChange={handleChange}
                          placeholder="MM/YY"
                          className={`appearance-none block w-full px-3 py-3 pr-10 border ${
                            errors.expiryDate ? 'border-red-300' : 'border-gray-300'
                          } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                        />
                      </div>
                      {errors.expiryDate && (
                        <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                      Security Code (CVV)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="cvv"
                          name="cvv"
                          type="text"
                          maxLength={3}
                          value={paymentInfo.cvv}
                          onChange={handleChange}
                          placeholder="123"
                          className={`appearance-none block w-full px-3 py-3 pr-10 border ${
                            errors.cvv ? 'border-red-300' : 'border-gray-300'
                          } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                        />
                      </div>
                      {errors.cvv && (
                        <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full mt-6 bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition"
                >
                  Complete payment (${course.price})
                </button>
              </form>
            </>
          )}
          
          {step === 'processing' && (
            <div className="py-8 flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 text-center">
              Please wait while we process your payment...
              </p>
            </div>
          )}
          
          {step === 'success' && (
            <div className="py-8 flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Purchase successful!</h4>
              <p className="text-gray-600 text-center mb-6">
              The course "{course.title}" has been successfully purchased. You now have access to all course content..
              </p>
              <button
                onClick={handleComplete}
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition"
              >
                Start learning now
              </button>
            </div>
          )}

          {step === 'error' && (
            <div className="py-8 flex flex-col items-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="h-10 w-10 text-red-500" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">An error occurred!</h4>
              <p className="text-gray-600 text-center mb-6">
                {errorMessage}
              </p>
              <div className="flex gap-4 w-full">
                <button
                  onClick={handleRetry}
                  className="flex-1 bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition"
                >
                  try again
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition"
                >
                  cancellation
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}