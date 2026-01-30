// src/components/layout/AuthLayout.jsx
import Logo_auth from '../common/Logo_auth';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-bl from-primary-100/30 to-transparent rotate-12 transform origin-center" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-primary-100/20 to-transparent -rotate-12 transform origin-center" />
        
        {/* Decorative lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#9E3E37" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="mb-8 animate-fade-in">
          <Logo_auth size="large" />
        </div>

        {/* Title */}
        {title && (
          <div className="text-center mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-primary mb-2">
              {title}
            </h1>
            {subtitle && (
              <p className="text-neutral-500 text-sm sm:text-base">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Card */}
        <div className="w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 border border-white/50">
            {children}
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-neutral-400">
          © {new Date().getFullYear()} L'AS DU PLACO. Tous droits réservés.
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;