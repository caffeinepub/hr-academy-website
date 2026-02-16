import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { Course, GalleryImage, ContactInfo, UserProfile, CourseCategory, ExternalBlob, ReviewImage, SubmittedReview, HomePageContent } from '@/backend';

export function useGetCourses() {
  const { actor, isFetching } = useActor();

  return useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCourses();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetGalleryImages() {
  const { actor, isFetching } = useActor();

  return useQuery<GalleryImage[]>({
    queryKey: ['galleryImages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGalleryImages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetFeaturedGalleryImages() {
  const { actor, isFetching } = useActor();

  return useQuery<GalleryImage[]>({
    queryKey: ['featuredGalleryImages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFeaturedGalleryImages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetFeaturedGalleryImageIDs() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<string[]>({
    queryKey: ['featuredGalleryImageIDs'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFeaturedGalleryImageIDs();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useSetFeaturedGalleryImageIDs() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (imageIDs: string[]) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.setFeaturedGalleryImageIDs(imageIDs);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featuredGalleryImageIDs'] });
      queryClient.invalidateQueries({ queryKey: ['featuredGalleryImages'] });
    },
  });
}

export function useGetContactInfo() {
  const { actor, isFetching } = useActor();

  return useQuery<ContactInfo>({
    queryKey: ['contactInfo'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getContactInfo();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitInternationalInquiry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; email: string; message: string; country: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      const id = `intl-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      await actor.submitInternationalInquiry(id, data.name, data.email, data.message, data.country);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['internationalInquiries'] });
    },
  });
}

// Reviews queries
export function useGetReviewImages() {
  const { actor, isFetching } = useActor();

  return useQuery<ReviewImage[]>({
    queryKey: ['reviewImages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReviewImages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSubmittedReviews() {
  const { actor, isFetching } = useActor();

  return useQuery<SubmittedReview[]>({
    queryKey: ['submittedReviews'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSubmittedReviews();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitReview() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string | null; content: string; rating: number }) => {
      if (!actor) throw new Error('Actor not initialized');
      const id = `review-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      await actor.submitReview(id, data.name, data.content, BigInt(data.rating));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submittedReviews'] });
    },
  });
}

export function useGetAllSubmittedReviews() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<SubmittedReview[]>({
    queryKey: ['adminSubmittedReviews'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSubmittedReviews();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useDeleteReview() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.deleteReview(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSubmittedReviews'] });
      queryClient.invalidateQueries({ queryKey: ['submittedReviews'] });
    },
  });
}

export function useAddReviewImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; image: ExternalBlob; caption: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.addReviewImage(data.id, data.image, data.caption);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviewImages'] });
    },
  });
}

export function useRemoveReviewImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.removeReviewImage(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviewImages'] });
    },
  });
}

// Admin queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useAddOrUpdateCourse() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; name: string; category: CourseCategory; description: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.addOrUpdateCourse(data.id, data.name, data.category, data.description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}

export function useRemoveCourse() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.removeCourse(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}

export function useAddOrUpdateGalleryImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; image: ExternalBlob; caption: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.addOrUpdateGalleryImage(data.id, data.image, data.caption);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryImages'] });
      queryClient.invalidateQueries({ queryKey: ['featuredGalleryImages'] });
    },
  });
}

export function useRemoveGalleryImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.removeGalleryImage(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryImages'] });
      queryClient.invalidateQueries({ queryKey: ['featuredGalleryImages'] });
      queryClient.invalidateQueries({ queryKey: ['featuredGalleryImageIDs'] });
    },
  });
}

export function useUpdateContactInfo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { phone: string; instagram: string; branches: string[]; ownerName: string; email: string; facebook: string; whatsapp: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.updateContactInfo(data.phone, data.instagram, data.branches, data.ownerName, data.email, data.facebook, data.whatsapp);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactInfo'] });
    },
  });
}

// Home Page Content queries
export function useGetHomePageContent(isPreview: boolean) {
  const { actor, isFetching } = useActor();

  return useQuery<HomePageContent>({
    queryKey: ['homePageContent', isPreview],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getHomePageContent(isPreview);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateHomePageContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: HomePageContent) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.updateHomePageContent(content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homePageContent', true] });
    },
  });
}

export function usePublishHomePageContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.publishHomePageContent();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homePageContent'] });
    },
  });
}
