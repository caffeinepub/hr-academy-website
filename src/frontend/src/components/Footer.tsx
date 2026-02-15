import { SiInstagram, SiFacebook } from 'react-icons/si';
import { Phone, MapPin, Heart, MessageCircle, Mail } from 'lucide-react';
import { useGetContactInfo, useGetHomePageContent } from '@/hooks/useQueries';
import BrandLogo from './BrandLogo';
import { usePreviewMode } from '@/hooks/usePreviewMode';

export default function Footer() {
  const { data: contactInfo } = useGetContactInfo();
  const { canPreview } = usePreviewMode();
  const { data: pageContent } = useGetHomePageContent(canPreview);

  const whatsappUrl = contactInfo?.whatsapp || 'https://wa.me/917799151318';
  const facebookUrl = contactInfo?.facebook || 'https://www.facebook.com/profile.php?id=61567195800253';
  const instagramHandle = contactInfo?.instagram || '@hr_academy_knr';
  const email = contactInfo?.email || 'hracademy2305@gmail.com';

  const appIdentifier = encodeURIComponent(window.location.hostname || 'hr-academy');

  return (
    <footer className="border-t border-accent-red/20 bg-black text-white">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About Section */}
          <div>
            <BrandLogo imageClassName="h-14 w-14" showText={false} className="mb-4" />
            <p className="text-sm text-gray-400">
              {pageContent?.aboutText || 'Empowering students with quality education and personalized attention.'}
            </p>
            {contactInfo?.ownerName && (
              <p className="text-xs text-gray-500 mt-3 founder-name">
                Founded and Directed by {contactInfo.ownerName}
              </p>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-accent-red">Quick Links</h3>
            <div className="space-y-3 text-sm">
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 hover:text-accent-red transition-colors group"
              >
                <MessageCircle className="h-4 w-4 text-accent-red flex-shrink-0" />
                <span>For International Students</span>
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-accent-red">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <Phone className="h-4 w-4 mt-0.5 text-accent-red flex-shrink-0" />
                <a href={`tel:${contactInfo?.phone || '+917799151318'}`} className="hover:text-accent-red transition-colors">
                  {contactInfo?.phone || '+91 77991 51318'}
                </a>
              </div>
              <div className="flex items-start space-x-2">
                <Mail className="h-4 w-4 mt-0.5 text-accent-red flex-shrink-0" />
                <a 
                  href={`mailto:${email}`}
                  className="hover:text-accent-red transition-colors"
                >
                  {email}
                </a>
              </div>
              <div className="flex items-start space-x-2">
                <SiInstagram className="h-4 w-4 mt-0.5 text-accent-red flex-shrink-0" />
                <a 
                  href={`https://instagram.com/${instagramHandle.replace('@', '')}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-accent-red transition-colors"
                >
                  {instagramHandle}
                </a>
              </div>
              <div className="flex items-start space-x-2">
                <SiFacebook className="h-4 w-4 mt-0.5 text-accent-red flex-shrink-0" />
                <a 
                  href={facebookUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-accent-red transition-colors"
                >
                  Facebook
                </a>
              </div>
            </div>
          </div>

          {/* Locations */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-accent-red">Our Branches</h3>
            <div className="space-y-3 text-sm text-gray-400">
              {contactInfo?.branches && contactInfo.branches.length > 0 ? (
                contactInfo.branches.map((branch, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-accent-red flex-shrink-0" />
                    <p>{branch}</p>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-accent-red flex-shrink-0" />
                    <p>IB Chowrasta, City Centre, Christian Colony, Karimnagar</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-accent-red flex-shrink-0" />
                    <p>Beside City Diamond, near Mahmoodia Masjid Kisan Nagar, Karimnagar</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-accent-red/20 text-center text-sm text-gray-400">
          <p className="flex items-center justify-center gap-1">
            © {new Date().getFullYear()}. Built with <Heart className="h-4 w-4 text-accent-red fill-accent-red" /> using{' '}
            <a 
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="text-accent-red hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
