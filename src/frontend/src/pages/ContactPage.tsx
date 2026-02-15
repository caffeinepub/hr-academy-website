import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, MapPin, Mail, Globe, Clock, MessageCircle } from 'lucide-react';
import { SiInstagram, SiFacebook } from 'react-icons/si';
import { useSubmitInternationalInquiry, useGetContactInfo, useGetHomePageContent } from '@/hooks/useQueries';
import { useState } from 'react';
import { toast } from 'sonner';
import { usePreviewMode } from '@/hooks/usePreviewMode';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    country: '',
  });

  const { canPreview } = usePreviewMode();
  const submitInternationalInquiry = useSubmitInternationalInquiry();
  const { data: contactInfo } = useGetContactInfo();
  const { data: pageContent } = useGetHomePageContent(canPreview);

  const whatsappUrl = contactInfo?.whatsapp || 'https://wa.me/917799151318';
  const facebookUrl = contactInfo?.facebook || 'https://www.facebook.com/profile.php?id=61567195800253';
  const instagramHandle = contactInfo?.instagram || '@hr_academy_knr';
  const email = contactInfo?.email || 'hracademy2305@gmail.com';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message || !formData.country) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await submitInternationalInquiry.mutateAsync(formData);
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', message: '', country: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    }
  };

  const contactInfoItems = [
    {
      icon: Phone,
      title: 'Phone',
      content: contactInfo?.phone || '+91 77991 51318',
      link: `tel:${contactInfo?.phone || '+917799151318'}`,
    },
    {
      icon: Mail,
      title: 'Email',
      content: email,
      link: `mailto:${email}`,
    },
    {
      icon: SiInstagram,
      title: 'Instagram',
      content: instagramHandle,
      link: `https://instagram.com/${instagramHandle.replace('@', '')}`,
    },
    {
      icon: SiFacebook,
      title: 'Facebook',
      content: 'Facebook Page',
      link: facebookUrl,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-16">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Get in <span className="text-accent-red">Touch</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            {pageContent?.contactText || 'Have questions? We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.'}
          </p>
        </div>

        {/* International Students Section */}
        <div className="mb-12">
          <Card className="bg-gray-800 border-accent-red/30">
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center gap-2">
                <Globe className="h-6 w-6 text-accent-red" />
                International Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <p className="text-gray-300">
                    We welcome students from around the world! For international inquiries, please use the contact form or reach us directly via WhatsApp.
                  </p>
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-900/50">
                    <Clock className="h-5 w-5 text-accent-red mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-400">Time Zone</p>
                      <p className="text-white font-medium">Indian Standard Time (IST)</p>
                      <p className="text-xs text-gray-500">UTC +5:30</p>
                    </div>
                  </div>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start space-x-3 p-3 rounded-lg bg-accent-red/10 hover:bg-accent-red/20 transition-colors border border-accent-red/30"
                  >
                    <MessageCircle className="h-5 w-5 text-accent-red mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-400">WhatsApp</p>
                      <p className="text-white font-medium">Contact for Consultation & Queries</p>
                      <p className="text-xs text-gray-500">Click to chat with us</p>
                    </div>
                  </a>
                </div>

                {/* International Contact Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="intl-name" className="text-white">Name</Label>
                    <Input
                      id="intl-name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-gray-900 border-accent-red/20 text-white placeholder:text-gray-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="intl-email" className="text-white">Email</Label>
                    <Input
                      id="intl-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-gray-900 border-accent-red/20 text-white placeholder:text-gray-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="intl-country" className="text-white">Country</Label>
                    <Input
                      id="intl-country"
                      placeholder="Your country"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="bg-gray-900 border-accent-red/20 text-white placeholder:text-gray-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="intl-message" className="text-white">Message</Label>
                    <Textarea
                      id="intl-message"
                      placeholder="Tell us about your inquiry..."
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="bg-gray-900 border-accent-red/20 text-white placeholder:text-gray-500"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-accent-red hover:bg-accent-red/90 text-white"
                    disabled={submitInternationalInquiry.isPending}
                  >
                    {submitInternationalInquiry.isPending ? 'Sending...' : 'Send International Inquiry'}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Methods */}
            <Card className="bg-gray-800 border-accent-red/20">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactInfoItems.map((info, index) => (
                  <a
                    key={index}
                    href={info.link}
                    target={info.link.startsWith('http') ? '_blank' : undefined}
                    rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-700/50 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-accent-red/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-red/20 transition-colors">
                      <info.icon className="h-5 w-5 text-accent-red" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">{info.title}</p>
                      <p className="text-white font-medium">{info.content}</p>
                    </div>
                  </a>
                ))}
              </CardContent>
            </Card>

            {/* Locations */}
            <Card className="bg-gray-800 border-accent-red/20">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Our Branches</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactInfo?.branches && contactInfo.branches.length > 0 ? (
                  contactInfo.branches.map((branch, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3">
                      <div className="w-10 h-10 rounded-full bg-accent-red/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-5 w-5 text-accent-red" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Branch {index + 1}</p>
                        <p className="text-sm text-gray-400">{branch}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-start space-x-3 p-3">
                      <div className="w-10 h-10 rounded-full bg-accent-red/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-5 w-5 text-accent-red" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Branch 1</p>
                        <p className="text-sm text-gray-400">IB Chowrasta, City Centre, Christian Colony, Karimnagar</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3">
                      <div className="w-10 h-10 rounded-full bg-accent-red/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-5 w-5 text-accent-red" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Branch 2</p>
                        <p className="text-sm text-gray-400">Beside City Diamond, near Mahmoodia Masjid Kisan Nagar, Karimnagar</p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
