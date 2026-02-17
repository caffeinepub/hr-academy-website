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
import { useGetCallerUserProfile, useIsCallerAdmin, useAddOrUpdateCourse, useRemoveCourse, useAddOrUpdateGalleryImage, useRemoveGalleryImage, useUpdateContactInfo, useGetCourses, useGetGalleryImages, useGetContactInfo, useAddReviewImage, useRemoveReviewImage, useGetReviewImages, useGetAllSubmittedReviews, useDeleteReview, useGetHomePageContent, useUpdateHomePageContent, usePublishHomePageContent, useGetFeaturedGalleryImageIDs, useSetFeaturedGalleryImageIDs, useGetBuildInfo } from '@/hooks/useQueries';
import { CourseCategory, ExternalBlob } from '@/backend';
import { toast } from 'sonner';
import { Trash2, Plus, Upload, BookOpen, Image, Users, Settings, FileText, Eye, Save, CheckCircle, Star, RefreshCw, AlertTriangle, Activity } from 'lucide-react';
import { usePreviewMode } from '@/hooks/usePreviewMode';
import { FRONTEND_BUILD_VERSION, FRONTEND_BUILD_TIMESTAMP, formatBuildTimestamp } from '@/constants/buildInfo';
import { refreshPreview } from '@/utils/refreshPreview';

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
  const { data: backendBuildInfo, isLoading: buildInfoLoading } = useGetBuildInfo();

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
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const handleRefreshPreview = async () => {
    setIsRefreshing(true);
    try {
      await refreshPreview();
    } catch (error) {
      console.error('Refresh failed:', error);
      setIsRefreshing(false);
    }
  };

  // Check if frontend and backend versions match
  const versionsMatch = backendBuildInfo?.build === FRONTEND_BUILD_VERSION;
  const showVersionWarning = !buildInfoLoading && backendBuildInfo && !versionsMatch;

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

        {/* Build Diagnostics Section */}
        <Card className="bg-gray-800 border-accent-red/20 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-accent-red" />
              Build Diagnostics
            </CardTitle>
            <CardDescription className="text-gray-400">
              Frontend and backend version information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Frontend Build Info */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-300">Frontend</h3>
                <div className="bg-gray-900 rounded-lg p-3 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Version:</span>
                    <span className="text-white font-mono">{FRONTEND_BUILD_VERSION}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Built:</span>
                    <span className="text-white text-xs">{formatBuildTimestamp(FRONTEND_BUILD_TIMESTAMP)}</span>
                  </div>
                </div>
              </div>

              {/* Backend Build Info */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-300">Backend</h3>
                <div className="bg-gray-900 rounded-lg p-3 space-y-1">
                  {buildInfoLoading ? (
                    <p className="text-sm text-gray-400">Loading...</p>
                  ) : backendBuildInfo ? (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Version:</span>
                        <span className="text-white font-mono">{backendBuildInfo.build}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Built:</span>
                        <span className="text-white text-xs">
                          {formatBuildTimestamp(Number(backendBuildInfo.timestamp) / 1_000_000)}
                        </span>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-gray-400">Unable to fetch backend info</p>
                  )}
                </div>
              </div>
            </div>

            {/* Version Status */}
            {showVersionWarning ? (
              <Alert className="bg-yellow-900/20 border-yellow-600/50">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <AlertDescription className="text-yellow-200">
                  <strong>Version mismatch detected.</strong> The frontend (v{FRONTEND_BUILD_VERSION}) and backend (v{backendBuildInfo?.build}) versions differ. 
                  Your preview may be showing stale content. Try refreshing the page to load the latest version.
                </AlertDescription>
              </Alert>
            ) : backendBuildInfo && versionsMatch ? (
              <Alert className="bg-green-900/20 border-green-600/50">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-200">
                  <strong>Up to date.</strong> Frontend and backend versions match (v{FRONTEND_BUILD_VERSION}).
                </AlertDescription>
              </Alert>
            ) : null}

            {/* Refresh Action */}
            <div className="pt-2">
              <Button
                onClick={handleRefreshPreview}
                disabled={isRefreshing}
                variant="outline"
                className="w-full md:w-auto border-accent-red/50 text-white hover:bg-accent-red/10"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh Preview'}
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                Clears browser caches and reloads the page to ensure you're viewing the latest version.
              </p>
            </div>
          </CardContent>
        </Card>

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
          <TabsContent value="content">
            <Card className="bg-gray-800 border-accent-red/20">
              <CardHeader>
                <CardTitle className="text-white">Home Page Content</CardTitle>
                <CardDescription className="text-gray-400">
                  Edit the main content sections of your home page
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="heroTitle" className="text-white">Hero Title</Label>
                    <Input
                      id="heroTitle"
                      value={contentForm.heroTitle}
                      onChange={(e) => setContentForm({ ...contentForm, heroTitle: e.target.value })}
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="heroSubtitle" className="text-white">Hero Subtitle</Label>
                    <Input
                      id="heroSubtitle"
                      value={contentForm.heroSubtitle}
                      onChange={(e) => setContentForm({ ...contentForm, heroSubtitle: e.target.value })}
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="missionStatement" className="text-white">Mission Statement</Label>
                    <Textarea
                      id="missionStatement"
                      value={contentForm.missionStatement}
                      onChange={(e) => setContentForm({ ...contentForm, missionStatement: e.target.value })}
                      className="bg-gray-900 border-gray-700 text-white"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="testimonialsHeading" className="text-white">Testimonials Heading</Label>
                    <Input
                      id="testimonialsHeading"
                      value={contentForm.testimonialsHeading}
                      onChange={(e) => setContentForm({ ...contentForm, testimonialsHeading: e.target.value })}
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="aboutText" className="text-white">About Text (Footer)</Label>
                    <Textarea
                      id="aboutText"
                      value={contentForm.aboutText}
                      onChange={(e) => setContentForm({ ...contentForm, aboutText: e.target.value })}
                      className="bg-gray-900 border-gray-700 text-white"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="contactText" className="text-white">Contact Text</Label>
                    <Textarea
                      id="contactText"
                      value={contentForm.contactText}
                      onChange={(e) => setContentForm({ ...contentForm, contactText: e.target.value })}
                      className="bg-gray-900 border-gray-700 text-white"
                      rows={2}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSaveDraft}
                    disabled={updateHomePageContent.isPending}
                    className="bg-gray-700 hover:bg-gray-600 text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {updateHomePageContent.isPending ? 'Saving...' : 'Save Draft'}
                  </Button>
                  <Button
                    onClick={() => {
                      enterPreview();
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    variant="outline"
                    className="border-accent-red/50 text-white hover:bg-accent-red/10"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Changes
                  </Button>
                  <Button
                    onClick={handlePublish}
                    disabled={publishHomePageContent.isPending}
                    className="bg-accent-red hover:bg-accent-red-dark text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {publishHomePageContent.isPending ? 'Publishing...' : 'Publish Live'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses">
            <Card className="bg-gray-800 border-accent-red/20">
              <CardHeader>
                <CardTitle className="text-white">Manage Courses</CardTitle>
                <CardDescription className="text-gray-400">
                  Add, edit, or remove courses from your academy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleAddCourse} className="space-y-4">
                  <div>
                    <Label htmlFor="courseName" className="text-white">Course Name</Label>
                    <Input
                      id="courseName"
                      value={courseForm.name}
                      onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                      className="bg-gray-900 border-gray-700 text-white"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="courseCategory" className="text-white">Category</Label>
                    <Select
                      value={courseForm.category}
                      onValueChange={(value) => setCourseForm({ ...courseForm, category: value as CourseCategory })}
                    >
                      <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700">
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
                      className="bg-gray-900 border-gray-700 text-white"
                      rows={3}
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

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">Existing Courses</h3>
                  {courses.length === 0 ? (
                    <p className="text-gray-400">No courses added yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {courses.map((course) => (
                        <div
                          key={course.id}
                          className="flex items-center justify-between bg-gray-900 p-4 rounded-lg"
                        >
                          <div>
                            <h4 className="text-white font-medium">{course.name}</h4>
                            <p className="text-sm text-gray-400">{course.category}</p>
                          </div>
                          <Button
                            onClick={() => handleRemoveCourse(course.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery">
            <Card className="bg-gray-800 border-accent-red/20">
              <CardHeader>
                <CardTitle className="text-white">Gallery Management</CardTitle>
                <CardDescription className="text-gray-400">
                  Upload and manage gallery images. Select up to 4 images to feature on the home page.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="galleryUpload" className="text-white">Upload Images</Label>
                  <Input
                    id="galleryUpload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryUpload}
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                  {galleryUploadProgress !== null && (
                    <div className="mt-2">
                      <Progress value={galleryUploadProgress} className="h-2" />
                      <p className="text-sm text-gray-400 mt-1">{galleryUploadProgress}% uploaded</p>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Gallery Images</h3>
                    <Button
                      onClick={handleSaveFeaturedImages}
                      disabled={setFeaturedGalleryImageIDs.isPending}
                      size="sm"
                      className="bg-accent-red hover:bg-accent-red-dark text-white"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {setFeaturedGalleryImageIDs.isPending ? 'Saving...' : 'Save Featured'}
                    </Button>
                  </div>
                  {galleryImages.length === 0 ? (
                    <p className="text-gray-400">No images uploaded yet.</p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {galleryImages.map((image) => (
                        <div key={image.id} className="relative group">
                          <img
                            src={image.image.getDirectURL()}
                            alt={image.caption}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col items-center justify-center gap-2">
                            <div className="flex items-center gap-2 bg-gray-900 px-3 py-2 rounded">
                              <Checkbox
                                id={`featured-${image.id}`}
                                checked={selectedFeaturedIDs.includes(image.id)}
                                onCheckedChange={(checked) => handleToggleFeatured(image.id, checked as boolean)}
                              />
                              <Label htmlFor={`featured-${image.id}`} className="text-white text-sm cursor-pointer">
                                Featured
                              </Label>
                            </div>
                            <Button
                              onClick={() => handleRemoveGalleryImage(image.id)}
                              variant="destructive"
                              size="sm"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                          <p className="text-xs text-gray-400 mt-1 truncate">{image.caption}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <div className="space-y-6">
              <Card className="bg-gray-800 border-accent-red/20">
                <CardHeader>
                  <CardTitle className="text-white">Review Screenshots</CardTitle>
                  <CardDescription className="text-gray-400">
                    Upload screenshots of reviews from social media or other platforms
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="reviewUpload" className="text-white">Upload Review Images</Label>
                    <Input
                      id="reviewUpload"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleReviewUpload}
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                    {reviewUploadProgress !== null && (
                      <div className="mt-2">
                        <Progress value={reviewUploadProgress} className="h-2" />
                        <p className="text-sm text-gray-400 mt-1">{reviewUploadProgress}% uploaded</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white">Uploaded Reviews</h3>
                    {reviewImages.length === 0 ? (
                      <p className="text-gray-400">No review images uploaded yet.</p>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {reviewImages.map((review) => (
                          <div key={review.id} className="relative group">
                            <img
                              src={review.image.getDirectURL()}
                              alt={review.caption}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                              <Button
                                onClick={() => handleRemoveReviewImage(review.id)}
                                variant="destructive"
                                size="sm"
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Remove
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-accent-red/20">
                <CardHeader>
                  <CardTitle className="text-white">User Submitted Reviews</CardTitle>
                  <CardDescription className="text-gray-400">
                    Reviews submitted by users through the website
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {submittedReviews.length === 0 ? (
                    <p className="text-gray-400">No user reviews submitted yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {submittedReviews.map((review) => (
                        <div
                          key={review.id}
                          className="bg-gray-900 p-4 rounded-lg flex items-start justify-between"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <p className="text-white font-medium">{review.name || 'Anonymous'}</p>
                              <div className="flex">
                                {Array.from({ length: Number(review.rating) }).map((_, i) => (
                                  <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-400 text-sm">{review.content}</p>
                          </div>
                          <Button
                            onClick={() => handleDeleteReview(review.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Contact Info Tab */}
          <TabsContent value="contact">
            <Card className="bg-gray-800 border-accent-red/20">
              <CardHeader>
                <CardTitle className="text-white">Contact Information</CardTitle>
                <CardDescription className="text-gray-400">
                  Update your academy's contact details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateContactInfo} className="space-y-4">
                  <div>
                    <Label htmlFor="phone" className="text-white">Phone Number</Label>
                    <Input
                      id="phone"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="instagram" className="text-white">Instagram Handle</Label>
                    <Input
                      id="instagram"
                      value={contactForm.instagram}
                      onChange={(e) => setContactForm({ ...contactForm, instagram: e.target.value })}
                      className="bg-gray-900 border-gray-700 text-white"
                      placeholder="@your_handle"
                    />
                  </div>

                  <div>
                    <Label htmlFor="facebook" className="text-white">Facebook URL</Label>
                    <Input
                      id="facebook"
                      value={contactForm.facebook}
                      onChange={(e) => setContactForm({ ...contactForm, facebook: e.target.value })}
                      className="bg-gray-900 border-gray-700 text-white"
                      placeholder="https://facebook.com/..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="whatsapp" className="text-white">WhatsApp URL</Label>
                    <Input
                      id="whatsapp"
                      value={contactForm.whatsapp}
                      onChange={(e) => setContactForm({ ...contactForm, whatsapp: e.target.value })}
                      className="bg-gray-900 border-gray-700 text-white"
                      placeholder="https://wa.me/..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="ownerName" className="text-white">Owner/Founder Name</Label>
                    <Input
                      id="ownerName"
                      value={contactForm.ownerName}
                      onChange={(e) => setContactForm({ ...contactForm, ownerName: e.target.value })}
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                  </div>

                  <div>
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
                        className="bg-gray-900 border-gray-700 text-white mb-2"
                        placeholder={`Branch ${index + 1} address`}
                      />
                    ))}
                    <Button
                      type="button"
                      onClick={() => setContactForm({ ...contactForm, branches: [...contactForm.branches, ''] })}
                      variant="outline"
                      size="sm"
                      className="mt-2 border-accent-red/50 text-white hover:bg-accent-red/10"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Branch
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    disabled={updateContactInfo.isPending}
                    className="bg-accent-red hover:bg-accent-red-dark text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {updateContactInfo.isPending ? 'Saving...' : 'Save Contact Info'}
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
