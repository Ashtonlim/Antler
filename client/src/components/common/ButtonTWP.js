// ButtonTailWindPrimary = ButtonTWP
// ButtonTailWindPrimary = ButtonTWP
// ButtonTailWindPrimary = ButtonTWP

import React from 'react'

const ButtonTWP = ({
  children,
  text,
  value,
  onClick,
  className = '',
  color = 'blue',
  disabled,
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`eDM disabled:opacity-50 bg-${color}-500 ${
        disabled ? 'cursor-not-allowed' : `hover:bg-${color}-600`
      } uppercase text-white font-bold hover:shadow-md px-4 py-2 rounded outline-none focus:outline-none ${className}`}
      value={value}
    >
      {children ? children : text}
    </button>
  )
}

export default ButtonTWP
