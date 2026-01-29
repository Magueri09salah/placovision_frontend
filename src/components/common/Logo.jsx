// src/components/common/Logo.jsx
import placovision from '../../assets/images/placovision.svg';

const Logo = ({ size = 'default', showText = true }) => {
  const sizes = {
    small: { logo: 'h-12' },
    default: { logo: 'h-12' },
    large: { logo: 'h-24' },
  };

  const { logo } = sizes[size];

  return (
    <div className="flex items-center gap-2">
      <img 
        src={placovision} 
        alt="L'AS DU PLACO" 
        className={`${logo} w-auto`}

      />
      <p className='font-display font-bold text-primary text-4xl tracking-tight leading-none'>
        PLACOVISION
      </p>
    </div>

  );
};

export default Logo;