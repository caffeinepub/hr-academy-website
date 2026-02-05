import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Course {
    id: string;
    name: string;
    description: string;
    category: CourseCategory;
}
export interface ContactInfo {
    ownerName: string;
    instagram: string;
    whatsapp: string;
    email: string;
    facebook: string;
    phone: string;
    branches: Array<string>;
}
export interface GalleryImage {
    id: string;
    caption: string;
    image: ExternalBlob;
}
export interface ReviewImage {
    id: string;
    caption: string;
    image: ExternalBlob;
}
export interface SubmittedReview {
    id: string;
    content: string;
    name?: string;
    rating: bigint;
}
export interface InternationalInquiry {
    country: string;
    name: string;
    email: string;
    message: string;
}
export interface UserProfile {
    name: string;
    role: string;
}
export enum CourseCategory {
    Engineering = "Engineering",
    Pharmacy = "Pharmacy",
    EntranceExam = "EntranceExam",
    Intermediate = "Intermediate"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addOrUpdateCourse(id: string, name: string, category: CourseCategory, description: string): Promise<void>;
    addOrUpdateGalleryImage(id: string, image: ExternalBlob, caption: string): Promise<void>;
    addReviewImage(id: string, image: ExternalBlob, caption: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteReview(id: string): Promise<void>;
    getAllSubmittedReviews(): Promise<Array<SubmittedReview>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContactInfo(): Promise<ContactInfo>;
    getCourses(): Promise<Array<Course>>;
    getGalleryImages(): Promise<Array<GalleryImage>>;
    getInternationalInquiries(): Promise<Array<InternationalInquiry>>;
    getReviewImages(): Promise<Array<ReviewImage>>;
    getSubmittedReviews(): Promise<Array<SubmittedReview>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    removeCourse(id: string): Promise<void>;
    removeGalleryImage(id: string): Promise<void>;
    removeReviewImage(id: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitInternationalInquiry(id: string, name: string, email: string, message: string, country: string): Promise<void>;
    submitReview(id: string, name: string | null, content: string, rating: bigint): Promise<void>;
    updateContactInfo(phone: string, instagram: string, branches: Array<string>, ownerName: string, email: string, facebook: string, whatsapp: string): Promise<void>;
}
