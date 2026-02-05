import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsCallerAdmin, useAddOrUpdateCourse, useRemoveCourse, useAddOrUpdateGalleryImage, useRemoveGalleryImage, useUpdateContactInfo, useGetCourses, useGetGalleryImages, useGetContactInfo, useAddReviewImage, useRemoveReviewImage, useGetReviewImages, useGetAllSubmittedReviews, useDeleteReview } from '@/hooks/useQueries';
import { CourseCategory, ExternalBlob } from '@/backend';
import { toast } from 'sonner';
import { Trash2, Upload, Settings, BookOpen, Image as ImageIcon, Phone, Shield, Loader2, Star as StarIcon } from 'lucide-react';
import LoginButton from '@/components/LoginButton';

export default function AdminPage() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: courses = [] } = useGetCourses();
  const { data: galleryImages = [] } = useGetGalleryImages();
  const { data: contactInfo } = useGetContactInfo();
  const { data: reviewImages = [] } = useGetReviewImages();
  const { data: submittedReviews = [] } = useGetAllSubmittedReviews();

  const addOrUpdateCourse = useAddOrUpdateCourse();
  const removeCourse = useRemoveCourse();
  const addOrUpdateGalleryImage = useAddOrUpdateGalleryImage();
  const removeGalleryImage = useRemoveGalleryImage();
  const updateContactInfo = useUpdateContactInfo();
  const addReviewImage = useAddReviewImage();
  const removeReviewImage = useRemoveReviewImage();
  const deleteReview = useDeleteReview();

  const [courseForm, setCourseForm] = useState({
    id: '',
    name: '',
    category: '' as CourseCategory | '',
    description: '',
  });

  const [galleryForm, setGalleryForm] = useState({
    id: '',
    caption: '',
    imageFile: null as File | null,
  });

  const [reviewImageForm, setReviewImageForm] = useState({
    id: '',
    caption: '',
    imageFile: null as File | null,
  });

  const [contactForm, setContactForm] = useState({
    phone: '',
    instagram: '',
    branches: '',
    ownerName: '',
    email: '',
    facebook: '',
    whatsapp: '',
  });

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;
  const isLoading = isInitializing || profileLoading || adminLoading;

  // Update contact form when contactInfo loads
  useEffect(() => {
    if (contactInfo) {
      setContactForm({
        phone: contactInfo.phone,
        instagram: contactInfo.instagram,
        branches: contactInfo.branches.join('\n'),
        ownerName: contactInfo.ownerName,
        email: contactInfo.email || 'hracademy2305@gmail.com',
        facebook: contactInfo.facebook || 'https://www.facebook.com/profile.php?id=61567195800253',
        whatsapp: contactInfo.whatsapp || 'https://wa.me/917799151318',
      });
    }
  }, [contactInfo]);

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.name || !courseForm.category || !courseForm.description) {
      toast.error('Please fill in all course fields');
      return;
    }

    try {
      const id = courseForm.id || `course-${Date.now()}`;
      await addOrUpdateCourse.mutateAsync({
        id,
        name: courseForm.name,
        category: courseForm.category as CourseCategory,
        description: courseForm.description,
      });
      toast.success('Course saved successfully');
      setCourseForm({ id: '', name: '', category: '', description: '' });
    } catch (error) {
      toast.error('Failed to save course');
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    
    try {
      await removeCourse.mutateAsync(id);
      toast.success('Course deleted successfully');
    } catch (error) {
      toast.error('Failed to delete course');
    }
  };

  const handleAddGalleryImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.caption || !galleryForm.imageFile) {
      toast.error('Please provide both image and caption');
      return;
    }

    try {
      const id = galleryForm.id || `gallery-${Date.now()}`;
      const arrayBuffer = await galleryForm.imageFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(uint8Array);

      await addOrUpdateGalleryImage.mutateAsync({
        id,
        image: blob,
        caption: galleryForm.caption,
      });
      toast.success('Gallery image uploaded successfully');
      setGalleryForm({ id: '', caption: '', imageFile: null });
    } catch (error) {
      toast.error('Failed to upload gallery image');
    }
  };

  const handleDeleteGalleryImage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    
    try {
      await removeGalleryImage.mutateAsync(id);
      toast.success('Gallery image deleted successfully');
    } catch (error) {
      toast.error('Failed to delete gallery image');
    }
  };

  const handleAddReviewImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewImageForm.caption || !reviewImageForm.imageFile) {
      toast.error('Please provide both image and caption');
      return;
    }

    try {
      const id = reviewImageForm.id || `review-${Date.now()}`;
      const arrayBuffer = await reviewImageForm.imageFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(uint8Array);

      await addReviewImage.mutateAsync({
        id,
        image: blob,
        caption: reviewImageForm.caption,
      });
      toast.success('Review screenshot uploaded successfully');
      setReviewImageForm({ id: '', caption: '', imageFile: null });
    } catch (error) {
      toast.error('Failed to upload review screenshot');
    }
  };

  const handleDeleteReviewImage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review screenshot?')) return;
    
    try {
      await removeReviewImage.mutateAsync(id);
      toast.success('Review screenshot deleted successfully');
    } catch (error) {
      toast.error('Failed to delete review screenshot');
    }
  };

  const handleDeleteSubmittedReview = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    try {
      await deleteReview.mutateAsync(id);
      toast.success('Review deleted successfully');
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  const handleUpdateContactInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.phone || !contactForm.instagram || !contactForm.ownerName) {
      toast.error('Please fill in all required contact fields');
      return;
    }

    try {
      const branches = contactForm.branches.split('\n').filter(b => b.trim());
      await updateContactInfo.mutateAsync({
        phone: contactForm.phone,
        instagram: contactForm.instagram,
        branches,
        ownerName: contactForm.ownerName,
        email: contactForm.email,
        facebook: contactForm.facebook,
        whatsapp: contactForm.whatsapp,
      });
      toast.success('Contact information updated successfully');
    } catch (error) {
      toast.error('Failed to update contact information');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-accent-red animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <Card className="bg-gray-800 border-accent-red/20 max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-white text-2xl flex items-center gap-2">
              <Shield className="h-6 w-6 text-accent-red" />
              Admin Access Required
            </CardTitle>
            <CardDescription className="text-gray-400">
              Please log in to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginButton />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <Card className="bg-gray-800 border-accent-red/20 max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Access Denied</CardTitle>
            <CardDescription className="text-gray-400">
              You do not have permission to access this page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="bg-gray-900 border-accent-red/20">
              <AlertDescription className="text-gray-300">
                Only administrators can access the admin panel. Please contact the site owner if you believe this is an error.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-16">
      <div className="container max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Admin <span className="text-accent-red">Panel</span>
          </h1>
          <p className="text-gray-400">Manage your HR Academy website content</p>
        </div>

        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList className="bg-gray-800 border border-accent-red/20">
            <TabsTrigger value="courses" className="data-[state=active]:bg-accent-red data-[state=active]:text-white">
              <BookOpen className="h-4 w-4 mr-2" />
              Courses
            </TabsTrigger>
            <TabsTrigger value="gallery" className="data-[state=active]:bg-accent-red data-[state=active]:text-white">
              <ImageIcon className="h-4 w-4 mr-2" />
              Gallery
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-accent-red data-[state=active]:text-white">
              <StarIcon className="h-4 w-4 mr-2" />
              Reviews
            </TabsTrigger>
            <TabsTrigger value="contact" className="data-[state=active]:bg-accent-red data-[state=active]:text-white">
              <Phone className="h-4 w-4 mr-2" />
              Contact Info
            </TabsTrigger>
            <TabsTrigger value="guide" className="data-[state=active]:bg-accent-red data-[state=active]:text-white">
              <Settings className="h-4 w-4 mr-2" />
              Owner Guide
            </TabsTrigger>
          </TabsList>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <Card className="bg-gray-800 border-accent-red/20">
              <CardHeader>
                <CardTitle className="text-white">Add/Edit Course</CardTitle>
                <CardDescription className="text-gray-400">
                  Only add courses for Intermediate and Competitive/Entrance exams
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddCourse} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="course-name" className="text-white">Course Name</Label>
                    <Input
                      id="course-name"
                      placeholder="e.g., Mathematics"
                      value={courseForm.name}
                      onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                      className="bg-gray-900 border-accent-red/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="course-category" className="text-white">Category</Label>
                    <Select value={courseForm.category} onValueChange={(value) => setCourseForm({ ...courseForm, category: value as CourseCategory })}>
                      <SelectTrigger className="bg-gray-900 border-accent-red/20 text-white">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-accent-red/20">
                        <SelectItem value={CourseCategory.Intermediate}>Intermediate</SelectItem>
                        <SelectItem value={CourseCategory.Engineering}>Engineering Entrance</SelectItem>
                        <SelectItem value={CourseCategory.Pharmacy}>Pharmacy Entrance</SelectItem>
                        <SelectItem value={CourseCategory.EntranceExam}>Competitive Exams</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="course-description" className="text-white">Description</Label>
                    <Textarea
                      id="course-description"
                      placeholder="Course description"
                      value={courseForm.description}
                      onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                      className="bg-gray-900 border-accent-red/20 text-white"
                    />
                  </div>
                  <Button type="submit" className="bg-accent-red hover:bg-accent-red/90 text-white" disabled={addOrUpdateCourse.isPending}>
                    {addOrUpdateCourse.isPending ? 'Saving...' : 'Save Course'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-accent-red/20">
              <CardHeader>
                <CardTitle className="text-white">Existing Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {courses.map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{course.name}</p>
                        <p className="text-sm text-gray-400">{course.category}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteCourse(course.id)}
                        className="text-accent-red hover:bg-accent-red/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="space-y-6">
            <Card className="bg-gray-800 border-accent-red/20">
              <CardHeader>
                <CardTitle className="text-white">Upload Gallery Image</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddGalleryImage} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="gallery-image" className="text-white">Image File</Label>
                    <Input
                      id="gallery-image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setGalleryForm({ ...galleryForm, imageFile: e.target.files?.[0] || null })}
                      className="bg-gray-900 border-accent-red/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gallery-caption" className="text-white">Caption</Label>
                    <Input
                      id="gallery-caption"
                      placeholder="Image caption"
                      value={galleryForm.caption}
                      onChange={(e) => setGalleryForm({ ...galleryForm, caption: e.target.value })}
                      className="bg-gray-900 border-accent-red/20 text-white"
                    />
                  </div>
                  <Button type="submit" className="bg-accent-red hover:bg-accent-red/90 text-white" disabled={addOrUpdateGalleryImage.isPending}>
                    <Upload className="h-4 w-4 mr-2" />
                    {addOrUpdateGalleryImage.isPending ? 'Uploading...' : 'Upload Image'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-accent-red/20">
              <CardHeader>
                <CardTitle className="text-white">Gallery Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {galleryImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.image.getDirectURL()}
                        alt={image.caption}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteGalleryImage(image.id)}
                          className="text-accent-red hover:bg-accent-red/10"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{image.caption}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <Card className="bg-gray-800 border-accent-red/20">
              <CardHeader>
                <CardTitle className="text-white">Upload Review Screenshot</CardTitle>
                <CardDescription className="text-gray-400">
                  Upload screenshots of reviews from social media or other platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddReviewImage} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="review-image" className="text-white">Screenshot File</Label>
                    <Input
                      id="review-image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setReviewImageForm({ ...reviewImageForm, imageFile: e.target.files?.[0] || null })}
                      className="bg-gray-900 border-accent-red/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="review-caption" className="text-white">Caption (Optional)</Label>
                    <Input
                      id="review-caption"
                      placeholder="e.g., Review from Instagram"
                      value={reviewImageForm.caption}
                      onChange={(e) => setReviewImageForm({ ...reviewImageForm, caption: e.target.value })}
                      className="bg-gray-900 border-accent-red/20 text-white"
                    />
                  </div>
                  <Button type="submit" className="bg-accent-red hover:bg-accent-red/90 text-white" disabled={addReviewImage.isPending}>
                    <Upload className="h-4 w-4 mr-2" />
                    {addReviewImage.isPending ? 'Uploading...' : 'Upload Screenshot'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-accent-red/20">
              <CardHeader>
                <CardTitle className="text-white">Review Screenshots</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {reviewImages.map((review) => (
                    <div key={review.id} className="relative group">
                      <img
                        src={review.image.getDirectURL()}
                        alt={review.caption}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteReviewImage(review.id)}
                          className="text-accent-red hover:bg-accent-red/10"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                      {review.caption && (
                        <p className="text-xs text-gray-400 mt-1">{review.caption}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-accent-red/20">
              <CardHeader>
                <CardTitle className="text-white">Submitted Reviews</CardTitle>
                <CardDescription className="text-gray-400">
                  Reviews submitted by visitors through the website
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {submittedReviews.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">No reviews submitted yet</p>
                  ) : (
                    submittedReviews.map((review) => (
                      <div key={review.id} className="p-4 bg-gray-900 rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium">
                              {review.name || 'Anonymous'}
                            </p>
                            <div className="flex items-center space-x-1 mt-1">
                              {Array.from({ length: Number(review.rating) }).map((_, i) => (
                                <StarIcon key={i} className="h-4 w-4 fill-accent-red text-accent-red" />
                              ))}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteSubmittedReview(review.id)}
                            className="text-accent-red hover:bg-accent-red/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-gray-300 text-sm">{review.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Info Tab */}
          <TabsContent value="contact" className="space-y-6">
            <Card className="bg-gray-800 border-accent-red/20">
              <CardHeader>
                <CardTitle className="text-white">Update Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateContactInfo} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-phone" className="text-white">Phone Number</Label>
                    <Input
                      id="contact-phone"
                      placeholder="+91 77991 51318"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      className="bg-gray-900 border-accent-red/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email" className="text-white">Email Address</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="hracademy2305@gmail.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="bg-gray-900 border-accent-red/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-whatsapp" className="text-white">WhatsApp URL</Label>
                    <Input
                      id="contact-whatsapp"
                      placeholder="https://wa.me/917799151318"
                      value={contactForm.whatsapp}
                      onChange={(e) => setContactForm({ ...contactForm, whatsapp: e.target.value })}
                      className="bg-gray-900 border-accent-red/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-instagram" className="text-white">Instagram Handle</Label>
                    <Input
                      id="contact-instagram"
                      placeholder="@hr_academy_knr"
                      value={contactForm.instagram}
                      onChange={(e) => setContactForm({ ...contactForm, instagram: e.target.value })}
                      className="bg-gray-900 border-accent-red/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-facebook" className="text-white">Facebook Page URL</Label>
                    <Input
                      id="contact-facebook"
                      placeholder="https://www.facebook.com/profile.php?id=61567195800253"
                      value={contactForm.facebook}
                      onChange={(e) => setContactForm({ ...contactForm, facebook: e.target.value })}
                      className="bg-gray-900 border-accent-red/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-owner" className="text-white">Owner/Director Name</Label>
                    <Input
                      id="contact-owner"
                      placeholder="Haqeeb Raja Bahmood"
                      value={contactForm.ownerName}
                      onChange={(e) => setContactForm({ ...contactForm, ownerName: e.target.value })}
                      className="bg-gray-900 border-accent-red/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-branches" className="text-white">Branch Locations (one per line)</Label>
                    <Textarea
                      id="contact-branches"
                      placeholder="Enter each branch address on a new line"
                      rows={4}
                      value={contactForm.branches}
                      onChange={(e) => setContactForm({ ...contactForm, branches: e.target.value })}
                      className="bg-gray-900 border-accent-red/20 text-white"
                    />
                  </div>
                  <Button type="submit" className="bg-accent-red hover:bg-accent-red/90 text-white" disabled={updateContactInfo.isPending}>
                    {updateContactInfo.isPending ? 'Updating...' : 'Update Contact Info'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Owner Guide Tab */}
          <TabsContent value="guide" className="space-y-6">
            <Card className="bg-gray-800 border-accent-red/20">
              <CardHeader>
                <CardTitle className="text-white">Owner Management Guide</CardTitle>
                <CardDescription className="text-gray-400">
                  Instructions for managing your HR Academy website
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 text-gray-300">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-accent-red" />
                    Managing Courses
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Go to the "Courses" tab to add new courses or edit existing ones</li>
                    <li>Only add courses for Intermediate and Competitive/Entrance exams</li>
                    <li>Fill in the course name, select a category, and provide a description</li>
                    <li>Click "Save Course" to add it to your website</li>
                    <li>To delete a course, click the trash icon next to it in the list</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-accent-red" />
                    Managing Gallery
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Go to the "Gallery" tab to upload new images</li>
                    <li>Select an image file from your computer</li>
                    <li>Add a caption describing the image</li>
                    <li>Click "Upload Image" to add it to your gallery</li>
                    <li>To delete an image, hover over it and click the trash icon</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                    <StarIcon className="h-5 w-5 text-accent-red" />
                    Managing Reviews
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Go to the "Reviews" tab to manage review content</li>
                    <li>Upload screenshots of reviews from social media or other platforms</li>
                    <li>View reviews submitted by visitors through the website form</li>
                    <li>Reviews can be submitted anonymously or with a name</li>
                    <li>To delete a review screenshot, hover over it and click the trash icon</li>
                    <li>To delete a submitted review, click the trash icon next to it</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                    <Phone className="h-5 w-5 text-accent-red" />
                    Updating Contact Information
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Go to the "Contact Info" tab to update your contact details</li>
                    <li>Update phone, email, WhatsApp URL, Instagram, and Facebook</li>
                    <li>Add or modify branch locations (one per line)</li>
                    <li>Click "Update Contact Info" to save changes</li>
                    <li>Changes will appear on the homepage, footer, and contact page</li>
                  </ul>
                </div>

                <Alert className="bg-gray-900 border-accent-red/20">
                  <AlertDescription className="text-gray-300">
                    <strong className="text-white">Note:</strong> This admin panel is only accessible to logged-in administrators. 
                    Keep your login credentials secure and do not share them with unauthorized users.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
