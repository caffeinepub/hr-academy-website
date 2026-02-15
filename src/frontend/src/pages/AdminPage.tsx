import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsCallerAdmin, useAddOrUpdateCourse, useRemoveCourse, useAddOrUpdateGalleryImage, useRemoveGalleryImage, useUpdateContactInfo, useGetCourses, useGetGalleryImages, useGetContactInfo, useAddReviewImage, useRemoveReviewImage, useGetReviewImages, useGetAllSubmittedReviews, useDeleteReview, useGetHomePageContent, useUpdateHomePageContent, usePublishHomePageContent } from '@/hooks/useQueries';
import { CourseCategory, ExternalBlob } from '@/backend';
import { toast } from 'sonner';
import { Trash2, Plus, Upload, BookOpen, Image, Users, Settings, FileText, Eye, Save, CheckCircle, Star } from 'lucide-react';
import { usePreviewMode } from '@/hooks/usePreviewMode';

export default function AdminPage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: isAdmin = false } = useIsCallerAdmin();
  const { enterPreview } = usePreviewMode();

  const { data: courses = [] } = useGetCourses();
  const { data: galleryImages = [] } = useGetGalleryImages();
  const { data: contactInfo } = useGetContactInfo();
  const { data: reviewImages = [] } = useGetReviewImages();
  const { data: submittedReviews = [] } = useGetAllSubmittedReviews();
  const { data: draftContent } = useGetHomePageContent(true);

  const addOrUpdateCourse = useAddOrUpdateCourse();
  const removeCourse = useRemoveCourse();
  const addOrUpdateGalleryImage = useAddOrUpdateGalleryImage();
  const removeGalleryImage = useRemoveGalleryImage();
  const updateContactInfo = useUpdateContactInfo();
  const addReviewImage = useAddReviewImage();
  const removeReviewImage = useRemoveReviewImage();
  const deleteReview = useDeleteReview();
  const updateHomePageContent = useUpdateHomePageContent();
  const publishHomePageContent = usePublishHomePageContent();

  const [courseForm, setCourseForm] = useState({
    id: '',
    name: '',
    category: 'Intermediate' as CourseCategory,
    description: '',
  });

  const [contactForm, setContactForm] = useState({
    phone: '',
    instagram: '',
    branches: ['', ''],
    ownerName: '',
    email: '',
    facebook: '',
    whatsapp: '',
  });

  const [contentForm, setContentForm] = useState({
    heroTitle: '',
    heroSubtitle: '',
    missionStatement: '',
    testimonialsHeading: '',
    aboutText: '',
    contactText: '',
  });

  const [galleryUploadProgress, setGalleryUploadProgress] = useState<number | null>(null);
  const [reviewUploadProgress, setReviewUploadProgress] = useState<number | null>(null);

  useEffect(() => {
    if (contactInfo) {
      setContactForm({
        phone: contactInfo.phone,
        instagram: contactInfo.instagram,
        branches: contactInfo.branches.length > 0 ? contactInfo.branches : ['', ''],
        ownerName: contactInfo.ownerName,
        email: contactInfo.email,
        facebook: contactInfo.facebook,
        whatsapp: contactInfo.whatsapp,
      });
    }
  }, [contactInfo]);

  useEffect(() => {
    if (draftContent) {
      setContentForm({
        heroTitle: draftContent.heroTitle,
        heroSubtitle: draftContent.heroSubtitle,
        missionStatement: draftContent.missionStatement,
        testimonialsHeading: draftContent.testimonialsHeading,
        aboutText: draftContent.aboutText,
        contactText: draftContent.contactText,
      });
    }
  }, [draftContent]);

  if (!identity) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center p-4">
        <Card className="bg-gray-800 border-accent-red/20 max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-white text-center">Admin Access Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 text-center">Please log in to access the admin panel.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center p-4">
        <Card className="bg-gray-800 border-accent-red/20 max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-white text-center">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 text-center">You do not have permission to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const id = courseForm.id || `course-${Date.now()}`;
      await addOrUpdateCourse.mutateAsync({ ...courseForm, id });
      toast.success('Course saved successfully');
      setCourseForm({ id: '', name: '', category: 'Intermediate' as CourseCategory, description: '' });
    } catch (error) {
      toast.error('Failed to save course');
    }
  };

  const handleRemoveCourse = async (id: string) => {
    try {
      await removeCourse.mutateAsync(id);
      toast.success('Course removed successfully');
    } catch (error) {
      toast.error('Failed to remove course');
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      try {
        const bytes = new Uint8Array(await file.arrayBuffer());
        const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
          setGalleryUploadProgress(percentage);
        });

        const id = `gallery-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        await addOrUpdateGalleryImage.mutateAsync({
          id,
          image: blob,
          caption: file.name,
        });
        toast.success(`${file.name} uploaded successfully`);
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`);
      } finally {
        setGalleryUploadProgress(null);
      }
    }
    e.target.value = '';
  };

  const handleRemoveGalleryImage = async (id: string) => {
    try {
      await removeGalleryImage.mutateAsync(id);
      toast.success('Image removed successfully');
    } catch (error) {
      toast.error('Failed to remove image');
    }
  };

  const handleReviewImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      try {
        const bytes = new Uint8Array(await file.arrayBuffer());
        const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
          setReviewUploadProgress(percentage);
        });

        const id = `review-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        await addReviewImage.mutateAsync({
          id,
          image: blob,
          caption: file.name,
        });
        toast.success(`${file.name} uploaded successfully`);
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`);
      } finally {
        setReviewUploadProgress(null);
      }
    }
    e.target.value = '';
  };

  const handleRemoveReviewImage = async (id: string) => {
    try {
      await removeReviewImage.mutateAsync(id);
      toast.success('Review image removed successfully');
    } catch (error) {
      toast.error('Failed to remove review image');
    }
  };

  const handleDeleteReview = async (id: string) => {
    try {
      await deleteReview.mutateAsync(id);
      toast.success('Review deleted successfully');
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  const handleUpdateContactInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateContactInfo.mutateAsync({
        ...contactForm,
        branches: contactForm.branches.filter(b => b.trim() !== ''),
      });
      toast.success('Contact information updated successfully');
    } catch (error) {
      toast.error('Failed to update contact information');
    }
  };

  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateHomePageContent.mutateAsync(contentForm);
      toast.success('Content saved as draft');
    } catch (error) {
      toast.error('Failed to save content');
    }
  };

  const handlePublishContent = async () => {
    try {
      await publishHomePageContent.mutateAsync();
      toast.success('Content published successfully');
    } catch (error) {
      toast.error('Failed to publish content');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-8">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Admin <span className="text-accent-red">Dashboard</span>
          </h1>
          {userProfile && (
            <p className="text-gray-400">Welcome back, {userProfile.name}</p>
          )}
        </div>

        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="bg-gray-800 border border-accent-red/20">
            <TabsTrigger value="content" className="data-[state=active]:bg-accent-red data-[state=active]:text-white">
              <FileText className="h-4 w-4 mr-2" />
              Site Content
            </TabsTrigger>
            <TabsTrigger value="courses" className="data-[state=active]:bg-accent-red data-[state=active]:text-white">
              <BookOpen className="h-4 w-4 mr-2" />
              Courses
            </TabsTrigger>
            <TabsTrigger value="gallery" className="data-[state=active]:bg-accent-red data-[state=active]:text-white">
              <Image className="h-4 w-4 mr-2" />
              Gallery
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-accent-red data-[state=active]:text-white">
              <Star className="h-4 w-4 mr-2" />
              Reviews
            </TabsTrigger>
            <TabsTrigger value="submitted" className="data-[state=active]:bg-accent-red data-[state=active]:text-white">
              <Users className="h-4 w-4 mr-2" />
              Submitted Reviews
            </TabsTrigger>
            <TabsTrigger value="contact" className="data-[state=active]:bg-accent-red data-[state=active]:text-white">
              <Settings className="h-4 w-4 mr-2" />
              Contact Info
            </TabsTrigger>
          </TabsList>

          {/* Site Content Tab */}
          <TabsContent value="content">
            <Card className="bg-gray-800 border-accent-red/20">
              <CardHeader>
                <CardTitle className="text-white">Edit Site Content</CardTitle>
                <CardDescription className="text-gray-400">
                  Update the text content across your website. Changes are saved as drafts and can be previewed before publishing.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveContent} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="heroTitle" className="text-white">Hero Title</Label>
                      <Input
                        id="heroTitle"
                        value={contentForm.heroTitle}
                        onChange={(e) => setContentForm({ ...contentForm, heroTitle: e.target.value })}
                        className="bg-gray-900 border-accent-red/20 text-white"
                        placeholder="e.g., Welcome to HR Academy"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="heroSubtitle" className="text-white">Hero Subtitle</Label>
                      <Input
                        id="heroSubtitle"
                        value={contentForm.heroSubtitle}
                        onChange={(e) => setContentForm({ ...contentForm, heroSubtitle: e.target.value })}
                        className="bg-gray-900 border-accent-red/20 text-white"
                        placeholder="e.g., Trusted by 6000+ parents worldwide"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="missionStatement" className="text-white">Mission Statement</Label>
                      <Textarea
                        id="missionStatement"
                        value={contentForm.missionStatement}
                        onChange={(e) => setContentForm({ ...contentForm, missionStatement: e.target.value })}
                        className="bg-gray-900 border-accent-red/20 text-white"
                        rows={5}
                        placeholder="Describe your academy's mission..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="testimonialsHeading" className="text-white">Testimonials Section Heading</Label>
                      <Input
                        id="testimonialsHeading"
                        value={contentForm.testimonialsHeading}
                        onChange={(e) => setContentForm({ ...contentForm, testimonialsHeading: e.target.value })}
                        className="bg-gray-900 border-accent-red/20 text-white"
                        placeholder="e.g., What Our Students Say"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="aboutText" className="text-white">About Text (Footer)</Label>
                      <Textarea
                        id="aboutText"
                        value={contentForm.aboutText}
                        onChange={(e) => setContentForm({ ...contentForm, aboutText: e.target.value })}
                        className="bg-gray-900 border-accent-red/20 text-white"
                        rows={3}
                        placeholder="Brief description for footer..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactText" className="text-white">Contact Page Intro</Label>
                      <Textarea
                        id="contactText"
                        value={contentForm.contactText}
                        onChange={(e) => setContentForm({ ...contentForm, contactText: e.target.value })}
                        className="bg-gray-900 border-accent-red/20 text-white"
                        rows={3}
                        placeholder="Introduction text for contact page..."
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      type="submit" 
                      className="bg-accent-red hover:bg-accent-red/90 text-white flex-1"
                      disabled={updateHomePageContent.isPending}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {updateHomePageContent.isPending ? 'Saving...' : 'Save Draft'}
                    </Button>
                    <Button 
                      type="button"
                      onClick={handlePublishContent}
                      className="bg-green-600 hover:bg-green-700 text-white flex-1"
                      disabled={publishHomePageContent.isPending}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {publishHomePageContent.isPending ? 'Publishing...' : 'Publish Changes'}
                    </Button>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-accent-red/20">
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => enterPreview('/')}
                      className="border-accent-red text-accent-red hover:bg-accent-red hover:text-white flex-1"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview Home Page
                    </Button>
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => enterPreview('/contact')}
                      className="border-accent-red text-accent-red hover:bg-accent-red hover:text-white flex-1"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview Contact Page
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="bg-gray-800 border-accent-red/20">
                <CardHeader>
                  <CardTitle className="text-white">Add/Edit Course</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddCourse} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="courseName" className="text-white">Course Name</Label>
                      <Input
                        id="courseName"
                        value={courseForm.name}
                        onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                        className="bg-gray-900 border-accent-red/20 text-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="courseCategory" className="text-white">Category</Label>
                      <Select
                        value={courseForm.category}
                        onValueChange={(value) => setCourseForm({ ...courseForm, category: value as CourseCategory })}
                      >
                        <SelectTrigger className="bg-gray-900 border-accent-red/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Intermediate">Intermediate</SelectItem>
                          <SelectItem value="Engineering">Engineering</SelectItem>
                          <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                          <SelectItem value="EntranceExam">Entrance Exam</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="courseDescription" className="text-white">Description</Label>
                      <Textarea
                        id="courseDescription"
                        value={courseForm.description}
                        onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                        className="bg-gray-900 border-accent-red/20 text-white"
                        rows={3}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-accent-red hover:bg-accent-red/90 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Course
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-accent-red/20">
                <CardHeader>
                  <CardTitle className="text-white">Existing Courses</CardTitle>
                </CardHeader>
                <CardContent>
                  {courses.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No courses added yet</p>
                  ) : (
                    <div className="space-y-3">
                      {courses.map((course) => (
                        <div key={course.id} className="flex items-start justify-between p-3 bg-gray-900 rounded-lg">
                          <div className="flex-1">
                            <h4 className="text-white font-medium">{course.name}</h4>
                            <p className="text-sm text-gray-400">{course.category}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveCourse(course.id)}
                            className="text-accent-red hover:bg-accent-red/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery">
            <Card className="bg-gray-800 border-accent-red/20">
              <CardHeader>
                <CardTitle className="text-white">Gallery Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="galleryUpload" className="text-white mb-2 block">Upload Images</Label>
                  <Input
                    id="galleryUpload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryUpload}
                    className="bg-gray-900 border-accent-red/20 text-white"
                  />
                  {galleryUploadProgress !== null && (
                    <div className="mt-2">
                      <Progress value={galleryUploadProgress} className="h-2" />
                      <p className="text-sm text-gray-400 mt-1">Uploading: {galleryUploadProgress}%</p>
                    </div>
                  )}
                </div>

                {galleryImages.length === 0 ? (
                  <Alert className="bg-gray-900 border-accent-red/20">
                    <AlertDescription className="text-gray-400">
                      No images in gallery yet. Upload some images to get started.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {galleryImages.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.image.getDirectURL()}
                          alt={image.caption}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRemoveGalleryImage(image.id)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Review Screenshots Tab */}
          <TabsContent value="reviews">
            <Card className="bg-gray-800 border-accent-red/20">
              <CardHeader>
                <CardTitle className="text-white">Review Screenshots</CardTitle>
                <CardDescription className="text-gray-400">
                  Upload screenshots of student reviews from social media or other platforms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="reviewUpload" className="text-white mb-2 block">Upload Review Images</Label>
                  <Input
                    id="reviewUpload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleReviewImageUpload}
                    className="bg-gray-900 border-accent-red/20 text-white"
                  />
                  {reviewUploadProgress !== null && (
                    <div className="mt-2">
                      <Progress value={reviewUploadProgress} className="h-2" />
                      <p className="text-sm text-gray-400 mt-1">Uploading: {reviewUploadProgress}%</p>
                    </div>
                  )}
                </div>

                {reviewImages.length === 0 ? (
                  <Alert className="bg-gray-900 border-accent-red/20">
                    <AlertDescription className="text-gray-400">
                      No review screenshots uploaded yet.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {reviewImages.map((review) => (
                      <div key={review.id} className="relative group">
                        <img
                          src={review.image.getDirectURL()}
                          alt={review.caption}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRemoveReviewImage(review.id)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Submitted Reviews Tab */}
          <TabsContent value="submitted">
            <Card className="bg-gray-800 border-accent-red/20">
              <CardHeader>
                <CardTitle className="text-white">User Submitted Reviews</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage reviews submitted by users through the website
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submittedReviews.length === 0 ? (
                  <Alert className="bg-gray-900 border-accent-red/20">
                    <AlertDescription className="text-gray-400">
                      No reviews submitted yet.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-3">
                    {submittedReviews.map((review) => (
                      <div key={review.id} className="p-4 bg-gray-900 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-white font-medium">{review.name || 'Anonymous'}</p>
                            <div className="flex items-center space-x-1 mt-1">
                              {Array.from({ length: Number(review.rating) }).map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-accent-red text-accent-red" />
                              ))}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteReview(review.id)}
                            className="text-accent-red hover:bg-accent-red/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-gray-300 text-sm">{review.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Info Tab */}
          <TabsContent value="contact">
            <Card className="bg-gray-800 border-accent-red/20">
              <CardHeader>
                <CardTitle className="text-white">Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateContactInfo} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ownerName" className="text-white">Owner Name</Label>
                    <Input
                      id="ownerName"
                      value={contactForm.ownerName}
                      onChange={(e) => setContactForm({ ...contactForm, ownerName: e.target.value })}
                      className="bg-gray-900 border-accent-red/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white">Phone</Label>
                    <Input
                      id="phone"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      className="bg-gray-900 border-accent-red/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="bg-gray-900 border-accent-red/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram" className="text-white">Instagram Handle</Label>
                    <Input
                      id="instagram"
                      value={contactForm.instagram}
                      onChange={(e) => setContactForm({ ...contactForm, instagram: e.target.value })}
                      className="bg-gray-900 border-accent-red/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facebook" className="text-white">Facebook URL</Label>
                    <Input
                      id="facebook"
                      value={contactForm.facebook}
                      onChange={(e) => setContactForm({ ...contactForm, facebook: e.target.value })}
                      className="bg-gray-900 border-accent-red/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp" className="text-white">WhatsApp URL</Label>
                    <Input
                      id="whatsapp"
                      value={contactForm.whatsapp}
                      onChange={(e) => setContactForm({ ...contactForm, whatsapp: e.target.value })}
                      className="bg-gray-900 border-accent-red/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Branch Locations</Label>
                    {contactForm.branches.map((branch, index) => (
                      <Input
                        key={index}
                        value={branch}
                        onChange={(e) => {
                          const newBranches = [...contactForm.branches];
                          newBranches[index] = e.target.value;
                          setContactForm({ ...contactForm, branches: newBranches });
                        }}
                        className="bg-gray-900 border-accent-red/20 text-white"
                        placeholder={`Branch ${index + 1} address`}
                      />
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setContactForm({ ...contactForm, branches: [...contactForm.branches, ''] })}
                      className="w-full border-accent-red text-accent-red hover:bg-accent-red hover:text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Branch
                    </Button>
                  </div>
                  <Button type="submit" className="w-full bg-accent-red hover:bg-accent-red/90 text-white">
                    Update Contact Information
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
