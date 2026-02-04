// src/components/common/Logo.jsx
import placovision from '../../assets/images/placovision.svg';

const Logo = ({ size = 'default', showText = true }) => {
  const sizes = {
    small: { logo: 'h-12' },
    default: { logo: 'h-12' },
    large: { logo: 'h-28' },
  };

  const { logo } = sizes[size];

  return (
    <div className="flex flex-col items-center gap-4">
      <img 
        src={placovision} 
        alt="L'AS DU PLACO" 
        className={`${logo} w-auto`}

      />
      <p className='font-display font-bold text-primary text-3xl tracking-tight leading-none'>
        PLACOVISION
      </p>
    </div>

  );
};

export default Logo;