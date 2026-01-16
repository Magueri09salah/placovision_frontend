// src/components/common/Logo.jsx
const Logo = ({ size = 'default', showText = true }) => {
  const sizes = {
    small: { icon: 'w-10 h-10', text: 'text-xl' },
    default: { icon: 'w-14 h-14', text: 'text-2xl' },
    large: { icon: 'w-20 h-20', text: 'text-3xl' },
  };

  const { icon, text } = sizes[size];

  return (
    <div className="flex items-center gap-3">
      <div className={`${icon} bg-primary rounded-xl flex items-center justify-center shadow-lg`}>
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          className="w-2/3 h-2/3 text-white"
          stroke="currentColor" 
          strokeWidth="2"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" 
          />
        </svg>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`${text} font-bold text-primary tracking-tight`}>
            L'AS DU PLACO
          </span>
          <span className="text-xs text-neutral-500 font-medium tracking-wide">
            GESTION PRO
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;