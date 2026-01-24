// src/components/common/Logo.jsx
import logoSvg from '../../assets/images/logo.svg';

const Logo = ({ size = 'default', showText = true }) => {
  const sizes = {
    small: { logo: 'h-12' },
    default: { logo: 'h-12' },
    large: { logo: 'h-16' },
  };

  const { logo } = sizes[size];

  return (
    <div className="flex items-center">
      <img 
        src={logoSvg} 
        alt="L'AS DU PLACO" 
        className={`${logo} w-auto`}
      />
    </div>
  );
};

export default Logo;