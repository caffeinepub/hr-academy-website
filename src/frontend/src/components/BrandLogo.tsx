import { useState } from 'react';
import { BRAND_LOGO_PATH } from '@/constants/brandAssets';

interface BrandLogoProps {
  className?: string;
  imageClassName?: string;
  showText?: boolean;
  textSize?: 'sm' | 'md' | 'lg';
}

export default function BrandLogo({ 
  className = '', 
  imageClassName = 'h-12 w-12',
  showText = true,
  textSize = 'md'
}: BrandLogoProps) {
  const [imageError, setImageError] = useState(false);

  const textSizeClasses = {
    sm: { sub: 'text-xs' },
    md: { sub: 'text-sm' },
    lg: { sub: 'text-lg' }
  };

  const sizes = textSizeClasses[textSize];

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {!imageError && (
        <img 
          src={BRAND_LOGO_PATH}
          alt="HR Academy Logo" 
          className={`object-contain ${imageClassName}`}
          onError={() => setImageError(true)}
          loading="eager"
          fetchPriority="high"
          width="48"
          height="48"
        />
      )}
      {showText && (
        <div className="flex flex-col">
          <span className={`${sizes.sub} font-normal text-accent-red`}>ACADEMY</span>
        </div>
      )}
    </div>
  );
}
