import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from '@tanstack/react-router';
import { GraduationCap, Award, Users, BookOpen, UserCheck, Star } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';
import { useGetContactInfo, useGetReviewImages, useSubmitReview, useGetSubmittedReviews } from '@/hooks/useQueries';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import BrandLogo from '@/components/BrandLogo';

export default function HomePage() {
  const navigate = useNavigate();
  const { data: contactInfo } = useGetContactInfo();
  const { data: reviewImages = [] } = useGetReviewImages();
  const { data: submittedReviews = [] } = useGetSubmittedReviews();
  const submitReview = useSubmitReview();

  const [reviewForm, setReviewForm] = useState({
    name: '',
    content: '',
    rating: 5,
    anonymous: false,
  });

  const highlights = [
    {
      icon: GraduationCap,
      title: 'Expert Faculty',
      description: 'Learn from experienced educators dedicated to your success',
    },
    {
      icon: Award,
      title: 'Proven Results',
      description: 'Track record of excellent academic achievements',
    },
    {
      icon: Users,
      title: 'Small Batches',
      description: 'Personalized attention with limited students per batch',
    },
    {
      icon: UserCheck,
      title: '1-on-1 Online Mathematics',
      description: 'Personalized online Mathematics coaching for Grade 1 to Grade 10',
    },
    {
      icon: BookOpen,
      title: 'Comprehensive Courses',
      description: 'Intermediate boards and competitive exams (Medicine, Engineering, Business)',
    },
  ];

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reviewForm.content.trim()) {
      toast.error('Please write a review');
      return;
    }

    try {
      await submitReview.mutateAsync({
        name: reviewForm.anonymous ? null : reviewForm.name || null,
        content: reviewForm.content,
        rating: reviewForm.rating,
      });
      toast.success('Thank you for your review!');
      setReviewForm({ name: '', content: '', rating: 5, anonymous: false });
    } catch (error) {
      toast.error('Failed to submit review. Please try again.');
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-black text-white">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: 'url(/assets/generated/hero-banner.dim_1200x600.jpg)' }}
        />
        <div className="relative container py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="flex justify-center mb-6">
              <BrandLogo 
                imageClassName="h-40 w-40"
                showText={false}
              />
            </div>
            <h1 className="text-5xl md:text-7xl font-normal tracking-wider">
              HR <span className="text-accent-red">ACADEMY</span>
            </h1>
            <p className="text-2xl md:text-3xl font-semibold text-accent-red">
              Trusted by 6000+ parents worldwide
            </p>
            {contactInfo?.ownerName && (
              <p className="text-sm md:text-base text-gray-400 mt-3 founder-name">
                Founded and Directed by {contactInfo.ownerName}
              </p>
            )}
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Empowering students with quality education, personalized attention, and a commitment to excellence
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-accent-red text-accent-red hover:bg-accent-red hover:text-white"
                onClick={() => navigate({ to: '/contact' })}
              >
                Contact Us
              </Button>
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                onClick={() => window.open('https://wa.me/917799151318', '_blank', 'noopener,noreferrer')}
              >
                <SiWhatsapp className="h-5 w-5" />
                WhatsApp Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
            Why Choose <span className="text-accent-red">HR Academy</span>?
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {highlights.map((highlight, index) => (
              <Card key={index} className="bg-gray-800 border-accent-red/20 hover:border-accent-red/50 transition-colors">
                <CardContent className="pt-6 text-center space-y-4">
                  <div className="mx-auto w-12 h-12 rounded-full bg-accent-red/10 flex items-center justify-center">
                    <highlight.icon className="h-6 w-6 text-accent-red" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{highlight.title}</h3>
                  <p className="text-gray-400">{highlight.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-900">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Our <span className="text-accent-red">Mission</span>
              </h2>
              <p className="text-lg text-gray-300">
                At HR Academy, we are committed to providing exceptional education that transforms lives. 
                Our mission is to nurture academic excellence while building confidence and character in every student.
              </p>
              <p className="text-lg text-gray-300">
                With experienced faculty, proven teaching methodologies, and a student-centric approach, 
                we ensure that each learner receives the guidance and support needed to achieve their goals.
              </p>
              <p className="text-lg text-gray-300">
                We believe quality education should be accessible to all, which is why we offer very affordable fees 
                without compromising on the excellence of our teaching and resources.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="/assets/generated/classroom-session.dim_800x600.jpg" 
                alt="Classroom Session" 
                className="rounded-lg shadow-lg w-full h-48 object-cover"
              />
              <img 
                src="/assets/generated/student-success.dim_800x600.jpg" 
                alt="Student Success" 
                className="rounded-lg shadow-lg w-full h-48 object-cover mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 bg-black">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
            What Our <span className="text-accent-red">Students Say</span>
          </h2>

          {/* Review Screenshots */}
          {reviewImages.length > 0 && (
            <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {reviewImages.map((review) => (
                <div key={review.id} className="relative group">
                  <img
                    src={review.image.getDirectURL()}
                    alt={review.caption}
                    className="w-full h-64 object-cover rounded-lg border border-accent-red/20"
                  />
                  {review.caption && (
                    <p className="text-sm text-gray-400 mt-2 text-center">{review.caption}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Submitted Reviews Display */}
          {submittedReviews.length > 0 && (
            <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {submittedReviews.map((review) => (
                <Card key={review.id} className="bg-gray-800 border-accent-red/20">
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-white font-medium">
                        {review.name || 'Anonymous'}
                      </p>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Number(review.rating) }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-accent-red text-accent-red" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm">{review.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Review Submission Form */}
          <Card className="bg-gray-800 border-accent-red/20 max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold text-white mb-4">Leave a Review</h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="anonymous"
                    checked={reviewForm.anonymous}
                    onCheckedChange={(checked) => 
                      setReviewForm({ ...reviewForm, anonymous: checked as boolean })
                    }
                  />
                  <Label htmlFor="anonymous" className="text-white cursor-pointer">
                    Submit anonymously
                  </Label>
                </div>

                {!reviewForm.anonymous && (
                  <div className="space-y-2">
                    <Label htmlFor="review-name" className="text-white">
                      Your Name (Optional)
                    </Label>
                    <Input
                      id="review-name"
                      placeholder="Enter your name"
                      value={reviewForm.name}
                      onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                      className="bg-gray-900 border-accent-red/20 text-white placeholder:text-gray-500"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="review-rating" className="text-white">
                    Rating
                  </Label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            star <= reviewForm.rating
                              ? 'fill-accent-red text-accent-red'
                              : 'text-gray-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="review-content" className="text-white">
                    Your Review
                  </Label>
                  <Textarea
                    id="review-content"
                    placeholder="Share your experience with HR Academy..."
                    rows={4}
                    value={reviewForm.content}
                    onChange={(e) => setReviewForm({ ...reviewForm, content: e.target.value })}
                    className="bg-gray-900 border-accent-red/20 text-white placeholder:text-gray-500"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-accent-red hover:bg-accent-red/90 text-white"
                  disabled={submitReview.isPending}
                >
                  {submitReview.isPending ? 'Submitting...' : 'Submit Review'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900">
        <div className="container text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Ready to Start Your <span className="text-accent-red">Success Journey</span>?
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Join hundreds of successful students who have achieved their academic goals with HR Academy
          </p>
          <Button 
            size="lg" 
            className="bg-accent-red hover:bg-accent-red/90 text-white"
            onClick={() => navigate({ to: '/contact' })}
          >
            Get Started Today
          </Button>
        </div>
      </section>
    </div>
  );
}
