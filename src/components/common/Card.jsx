// src/components/common/Card.jsx
const Card = ({ children, className = '', hover = false }) => {
  return (
    <div 
      className={`
        card
        ${hover ? 'hover:shadow-card-hover transition-shadow duration-300' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;