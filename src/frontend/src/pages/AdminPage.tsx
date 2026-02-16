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
import { Checkbox } from '@/components/ui/checkbox';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsCallerAdmin, useAddOrUpdateCourse, useRemoveCourse, useAddOrUpdateGalleryImage, useRemoveGalleryImage, useUpdateContactInfo, useGetCourses, useGetGalleryImages, useGetContactInfo, useAddReviewImage, useRemoveReviewImage, useGetReviewImages, useGetAllSubmittedReviews, useDeleteReview, useGetHomePageContent, useUpdateHomePageContent, usePublishHomePageContent, useGetFeaturedGalleryImageIDs, useSetFeaturedGalleryImageIDs } from '@/hooks/useQueries';
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
  const { data: featuredImageIDs = [] } = useGetFeaturedGalleryImageIDs();

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
  const setFeaturedGalleryImageIDs = useSetFeaturedGalleryImageIDs();

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

  const [selectedFeaturedIDs, setSelectedFeaturedIDs] = useState<string[]>([]);
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

  useEffect(() => {
    if (featuredImageIDs) {
      setSelectedFeaturedIDs(featuredImageIDs);
    }
  }, [featuredImageIDs]);

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
        setGalleryUploadProgress(0);
        const arrayBuffer = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
          setGalleryUploadProgress(percentage);
        });

        const id = `gallery-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        await addOrUpdateGalleryImage.mutateAsync({
          id,
          image: blob,
          caption: file.name.replace(/\.[^/.]+$/, ''),
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

  const handleReviewUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      try {
        setReviewUploadProgress(0);
        const arrayBuffer = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
          setReviewUploadProgress(percentage);
        });

        const id = `review-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        await addReviewImage.mutateAsync({
          id,
          image: blob,
          caption: file.name.replace(/\.[^/.]+$/, ''),
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
      await updateContactInfo.mutateAsync(contactForm);
      toast.success('Contact information updated successfully');
    } catch (error) {
      toast.error('Failed to update contact information');
    }
  };

  const handleSaveDraft = async () => {
    try {
      await updateHomePageContent.mutateAsync(contentForm);
      toast.success('Draft saved successfully');
    } catch (error) {
      toast.error('Failed to save draft');
    }
  };

  const handlePublish = async () => {
    try {
      await publishHomePageContent.mutateAsync();
      toast.success('Content published successfully');
    } catch (error) {
      toast.error('Failed to publish content');
    }
  };

  const handleToggleFeatured = (imageId: string, checked: boolean) => {
    setSelectedFeaturedIDs((prev) => {
      if (checked) {
        if (prev.length >= 4) {
          toast.error('Maximum 4 images can be featured on the home page');
          return prev;
        }
        return [...prev, imageId];
      } else {
        return prev.filter((id) => id !== imageId);
      }
    });
  };

  const handleSaveFeaturedImages = async () => {
    try {
      await setFeaturedGalleryImageIDs.mutateAsync(selectedFeaturedIDs);
      toast.success('Featured images updated successfully');
    } catch (error) {
      toast.error('Failed to update featured images');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-8">
      <div className="container max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Admin <span className="text-accent-red">Dashboard</span>
          </h1>
          <p className="text-gray-400">
            Welcome back, {userProfile?.name || 'Admin'}
          </p>
        </div>

        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="bg-gray-800 border border-accent-red/20">
            <TabsTrigger value="content" className="data-[state=active]:bg-accent-red data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" />
              Site Content
            </TabsTrigger>
            <TabsTrigger value="courses" className="data-[state=active]:bg-accent-red data-[state=active]:text-white">
              <BookOpen className="w-4 h-4 mr-2" />
              Courses
            </TabsTrigger>
            <TabsTrigger value="gallery" className="data-[state=active]:bg-accent-red data-[state=active]:text-white">
              <Image className="w-4 h-4 mr-2" />
              Gallery
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-accent-red data-[state=active]:text-white">
              <Star className="w-4 h-4 mr-2" />
              Reviews
            </TabsTrigger>
            <TabsTrigger value="contact" className="data-[state=active]:bg-accent-red data-[state=active]:text-white">
              <Settings className="w-4 h-4 mr-2" />
              Contact Info
            </TabsTrigger>
          </TabsList>

          {/* Site Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <Card className="bg-gray-800 border-accent-red/20">
              <CardHeader>
                <CardTitle className="text-white">Edit Site Content</CardTitle>
                <CardDescription className="text-gray-400">
                  Update text content across your website pages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-4 mb-6">
                  <Button
                    onClick={() => enterPreview('/')}
                    variant="outline"
                    className="border-accent-red text-accent-red hover:bg-accent-red hover:text-white"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Home
                  </Button>
                  <Button
                    onClick={() => enterPreview('/contact')}
                    variant="outline"
                    className="border-accent-red text-accent-red hover:bg-accent-red hover:text-white"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Contact
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="heroTitle" className="text-white">Hero Title</Label>
                    <Input
                      id="heroTitle"
                      value={contentForm.heroTitle}
                      onChange={(e) => setContentForm({ ...contentForm, heroTitle: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="heroSubtitle" className="text-white">Hero Subtitle</Label>
                    <Input
                      id="heroSubtitle"
                      value={contentForm.heroSubtitle}
                      onChange={(e) => setContentForm({ ...contentForm, heroSubtitle: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="missionStatement" className="text-white">Mission Statement</Label>
                    <Textarea
                      id="missionStatement"
                      value={contentForm.missionStatement}
                      onChange={(e) => setContentForm({ ...contentForm, missionStatement: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="testimonialsHeading" className="text-white">Testimonials Heading</Label>
                    <Input
                      id="testimonialsHeading"
                      value={contentForm.testimonialsHeading}
                      onChange={(e) => setContentForm({ ...contentForm, testimonialsHeading: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="aboutText" className="text-white">About Text (Footer)</Label>
                    <Textarea
                      id="aboutText"
                      value={contentForm.aboutText}
                      onChange={(e) => setContentForm({ ...contentForm, aboutText: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contactText" className="text-white">Contact Page Intro Text</Label>
                    <Textarea
                      id="contactText"
                      value={contentForm.contactText}
                      onChange={(e) => setContentForm({ ...contentForm, contactText: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white min-h-[100px]"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={handleSaveDraft}
                    disabled={updateHomePageContent.isPending}
                    className="bg-gray-700 hover:bg-gray-600 text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {updateHomePageContent.isPending ? 'Saving...' : 'Save Draft'}
                  </Button>
                  <Button
                    onClick={handlePublish}
                    disabled={publishHomePageContent.isPending}
                    className="bg-accent-red hover:bg-accent-red-dark text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {publishHomePageContent.isPending ? 'Publishing...' : 'Publish'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <Card className="bg-gray-800 border-accent-red/20">
              <CardHeader>
                <CardTitle className="text-white">Add/Edit Course</CardTitle>
                <CardDescription className="text-gray-400">
                  Create or update course information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddCourse} className="space-y-4">
                  <div>
                    <Label htmlFor="courseName" className="text-white">Course Name</Label>
                    <Input
                      id="courseName"
                      value={courseForm.name}
                      onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="courseCategory" className="text-white">Category</Label>
                    <Select
                      value={courseForm.category}
                      onValueChange={(value) => setCourseForm({ ...courseForm, category: value as CourseCategory })}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                        <SelectItem value="EntranceExam">Entrance Exam</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="courseDescription" className="text-white">Description</Label>
                    <Textarea
                      id="courseDescription"
                      value={courseForm.description}
                      onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={addOrUpdateCourse.isPending}
                    className="bg-accent-red hover:bg-accent-red-dark text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {addOrUpdateCourse.isPending ? 'Saving...' : 'Add Course'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-accent-red/20">
              <CardHeader>
                <CardTitle className="text-white">Existing Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courses.map((course) => (
                    <div key={course.id} className="flex items-start justify-between p-4 bg-gray-700 rounded-lg">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold">{course.name}</h3>
                        <p className="text-gray-400 text-sm">{course.category}</p>
                        <p className="text-gray-300 text-sm mt-2">{course.description}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveCourse(course.id)}
                        disabled={removeCourse.isPending}
                        className="text-accent-red hover:bg-accent-red/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {courses.length === 0 && (
                    <p className="text-gray-400 text-center py-8">No courses added yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="space-y-6">
            <Card className="bg-gray-800 border-accent-red/20">
              <CardHeader>
                <CardTitle className="text-white">Upload Gallery Images</CardTitle>
                <CardDescription className="text-gray-400">
                  Add images to your gallery
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Label htmlFor="galleryUpload" className="cursor-pointer">
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-accent-red transition-colors">
                      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-white mb-2">Click to upload images</p>
                      <p className="text-gray-400 text-sm">Supports multiple files</p>
                    </div>
                    <Input
                      id="galleryUpload"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryUpload}
                      className="hidden"
                    />
                  </Label>

                  {galleryUploadProgress !== null && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>Uploading...</span>
                        <span>{Math.round(galleryUploadProgress)}%</span>
                      </div>
                      <Progress value={galleryUploadProgress} className="bg-gray-700" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-accent-red/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Gallery Images</CardTitle>
                    <CardDescription className="text-gray-400 mt-2">
                      Select up to 4 images to feature on the home page
                    </CardDescription>
                  </div>
                  <Button
                    onClick={handleSaveFeaturedImages}
                    disabled={setFeaturedGalleryImageIDs.isPending}
                    className="bg-accent-red hover:bg-accent-red-dark text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {setFeaturedGalleryImageIDs.isPending ? 'Saving...' : 'Save Featured'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {selectedFeaturedIDs.length > 0 && (
                  <Alert className="mb-4 bg-accent-red/10 border-accent-red/30">
                    <AlertDescription className="text-white">
                      {selectedFeaturedIDs.length} of 4 images selected for home page
                    </AlertDescription>
                  </Alert>
                )}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {galleryImages.map((image) => {
                    const isFeatured = selectedFeaturedIDs.includes(image.id);
                    const canSelect = selectedFeaturedIDs.length < 4 || isFeatured;

                    return (
                      <div key={image.id} className="relative group">
                        <div className="relative overflow-hidden rounded-lg border-2 border-gray-700 hover:border-accent-red transition-colors">
                          <img
                            src={image.image.getDirectURL()}
                            alt={image.caption}
                            className="w-full aspect-square object-cover"
                          />
                          <div className="absolute top-2 right-2 flex gap-2">
                            <div
                              className={`flex items-center gap-2 bg-black/70 rounded px-2 py-1 ${
                                !canSelect ? 'opacity-50' : ''
                              }`}
                            >
                              <Checkbox
                                id={`featured-${image.id}`}
                                checked={isFeatured}
                                onCheckedChange={(checked) => handleToggleFeatured(image.id, checked as boolean)}
                                disabled={!canSelect}
                                className="border-white data-[state=checked]:bg-accent-red data-[state=checked]:border-accent-red"
                              />
                              <Label
                                htmlFor={`featured-${image.id}`}
                                className="text-white text-xs cursor-pointer"
                              >
                                Featured
                              </Label>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveGalleryImage(image.id)}
                              disabled={removeGalleryImage.isPending}
                              className="bg-black/70 hover:bg-accent-red text-white h-8 w-8"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                            <p className="text-white text-xs truncate">{image.caption}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {galleryImages.length === 0 && (
                    <div className="col-span-full text-center py-12">
                      <p className="text-gray-400">No images uploaded yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <Card className="bg-gray-800 border-accent-red/20">
              <CardHeader>
                <CardTitle className="text-white">Upload Review Screenshots</CardTitle>
                <CardDescription className="text-gray-400">
                  Add screenshots of student reviews
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Label htmlFor="reviewUpload" className="cursor-pointer">
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-accent-red transition-colors">
                      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-white mb-2">Click to upload review screenshots</p>
                      <p className="text-gray-400 text-sm">Supports multiple files</p>
                    </div>
                    <Input
                      id="reviewUpload"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleReviewUpload}
                      className="hidden"
                    />
                  </Label>

                  {reviewUploadProgress !== null && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>Uploading...</span>
                        <span>{Math.round(reviewUploadProgress)}%</span>
                      </div>
                      <Progress value={reviewUploadProgress} className="bg-gray-700" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-accent-red/20">
              <CardHeader>
                <CardTitle className="text-white">Review Screenshots</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {reviewImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <div className="relative overflow-hidden rounded-lg border border-gray-700">
                        <img
                          src={image.image.getDirectURL()}
                          alt={image.caption}
                          className="w-full aspect-square object-cover"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveReviewImage(image.id)}
                          disabled={removeReviewImage.isPending}
                          className="absolute top-2 right-2 bg-black/70 hover:bg-accent-red text-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {reviewImages.length === 0 && (
                    <div className="col-span-full text-center py-12">
                      <p className="text-gray-400">No review screenshots uploaded yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-accent-red/20">
              <CardHeader>
                <CardTitle className="text-white">Submitted Reviews</CardTitle>
                <CardDescription className="text-gray-400">
                  Reviews submitted by users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {submittedReviews.map((review) => (
                    <div key={review.id} className="flex items-start justify-between p-4 bg-gray-700 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-white font-semibold">{review.name || 'Anonymous'}</h3>
                          <div className="flex">
                            {Array.from({ length: Number(review.rating) }).map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-accent-red text-accent-red" />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm">{review.content}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteReview(review.id)}
                        disabled={deleteReview.isPending}
                        className="text-accent-red hover:bg-accent-red/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {submittedReviews.length === 0 && (
                    <p className="text-gray-400 text-center py-8">No reviews submitted yet</p>
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
                <CardDescription className="text-gray-400">
                  Manage your academy's contact details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateContactInfo} className="space-y-4">
                  <div>
                    <Label htmlFor="ownerName" className="text-white">Owner Name</Label>
                    <Input
                      id="ownerName"
                      value={contactForm.ownerName}
                      onChange={(e) => setContactForm({ ...contactForm, ownerName: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-white">Phone</Label>
                    <Input
                      id="phone"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="whatsapp" className="text-white">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      value={contactForm.whatsapp}
                      onChange={(e) => setContactForm({ ...contactForm, whatsapp: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="instagram" className="text-white">Instagram Handle</Label>
                    <Input
                      id="instagram"
                      value={contactForm.instagram}
                      onChange={(e) => setContactForm({ ...contactForm, instagram: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="facebook" className="text-white">Facebook</Label>
                    <Input
                      id="facebook"
                      value={contactForm.facebook}
                      onChange={(e) => setContactForm({ ...contactForm, facebook: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <Label className="text-white">Branch Addresses</Label>
                    {contactForm.branches.map((branch, index) => (
                      <Input
                        key={index}
                        value={branch}
                        onChange={(e) => {
                          const newBranches = [...contactForm.branches];
                          newBranches[index] = e.target.value;
                          setContactForm({ ...contactForm, branches: newBranches });
                        }}
                        className="bg-gray-700 border-gray-600 text-white mt-2"
                        placeholder={`Branch ${index + 1} address`}
                        required
                      />
                    ))}
                  </div>

                  <Button
                    type="submit"
                    disabled={updateContactInfo.isPending}
                    className="bg-accent-red hover:bg-accent-red-dark text-white"
                  >
                    {updateContactInfo.isPending ? 'Updating...' : 'Update Contact Info'}
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
