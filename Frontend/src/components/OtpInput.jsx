import React, { useState, useRef, useEffect } from 'react';

const OtpInput = ({ otp, setOtp }) => { // Destructure props
  // otp prop is a string, but for managing individual inputs, we'll convert it to an array internally
  const [localOtpArray, setLocalOtpArray] = useState(otp.split(''));

  // Update localOtpArray when the otp prop changes (e.g., parent resets it)
  useEffect(() => {
    setLocalOtpArray(otp.split(''));
  }, [otp]);

  const inputRefs = useRef([]);
  for (let i = 0; i < 6; i++) {
    // Ensure that ref.current is a new ref for each input, preventing re-renders
    if (!inputRefs.current[i]) {
      inputRefs.current[i] = React.createRef();
    }
  }

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtpArray = [...localOtpArray];
      newOtpArray[index] = value;
      setLocalOtpArray(newOtpArray); // Update local state
      setOtp(newOtpArray.join('')); // Update parent's state

      // Move focus to the next input if a digit is entered and it's not the last box
      if (value.length === 1 && index < 5 && inputRefs.current[index + 1].current) {
        inputRefs.current[index + 1].current.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (localOtpArray[index] === '' && index > 0 && inputRefs.current[index - 1].current) {
        // If current box is empty, move focus to previous and clear it (optional, but common behavior)
        inputRefs.current[index - 1].current.focus();
        const newOtpArray = [...localOtpArray];
        newOtpArray[index - 1] = ''; // Clear the previous box
        setLocalOtpArray(newOtpArray);
        setOtp(newOtpArray.join('')); // Update parent's state
      } else if (localOtpArray[index] !== '') {
        // If current box has a value, clear it and stay
        const newOtpArray = [...localOtpArray];
        newOtpArray[index] = '';
        setLocalOtpArray(newOtpArray);
        setOtp(newOtpArray.join('')); // Update parent's state
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    if (pasteData.length === 6 && /^\d+$/.test(pasteData)) {
      const newOtpArray = pasteData.split('');
      setLocalOtpArray(newOtpArray); // Update local state
      setOtp(newOtpArray.join('')); // Update parent's state
      // Optionally focus on the last input after pasting
      if (inputRefs.current[5].current) {
        inputRefs.current[5].current.focus();
      }
    }
  };

  return (
    <div className="flex items-center justify-center space-x-1 mb-4"> {/* Reduced space-x and added margin-bottom */}
      {localOtpArray.map((digit, index) => (
        <input
          key={index}
          type="text"
          maxLength="1" // Only allow one character
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          ref={inputRefs.current[index]}
          className='bg-[#eee] p-1 text-center text-sm rounded-md w-8 h-8 border border-gray-300 focus:border-green-500 focus:outline-none' // Adjusted for very small size
          required
        />
      ))}
    </div>
  );
};

export default OtpInput;