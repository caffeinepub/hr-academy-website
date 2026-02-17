import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";

import MixinAuthorization "authorization/MixinAuthorization";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";

// Apply migration

actor {
  // Page content types
  public type HomePageContent = {
    heroTitle : Text;
    heroSubtitle : Text;
    missionStatement : Text;
    testimonialsHeading : Text;
    aboutText : Text;
    contactText : Text;
  };

  // Preview workflow state
  public type PreviewState<T> = {
    draft : T;
    published : T;
    isPreviewMode : Bool;
  };

  // Course Types
  type CourseCategory = {
    #Intermediate;
    #Engineering;
    #Pharmacy;
    #EntranceExam;
  };

  type Course = {
    id : Text;
    name : Text;
    category : CourseCategory;
    description : Text;
  };

  module Course {
    public func compare(course1 : Course, course2 : Course) : Order.Order {
      switch (course1.category, course2.category) {
        case (#Intermediate, #Engineering) { #less };
        case (#Engineering, #Intermediate) { #greater };
        case (#Intermediate, _) { #less };
        case (#Engineering, #Pharmacy) { #less };
        case (#Pharmacy, #Engineering) { #greater };
        case (#Pharmacy, #EntranceExam) { #less };
        case (#EntranceExam, #Pharmacy) { #greater };
        case (_, _) {
          if (course1.name < course2.name) { return #less };
          if (course1.name > course2.name) { return #greater };
          #equal;
        };
      };
    };
  };

  let courses = Map.empty<Text, Course>();

  // Gallery Image
  type GalleryImage = {
    id : Text;
    image : Storage.ExternalBlob;
    caption : Text;
  };

  let galleryImages = Map.empty<Text, GalleryImage>();

  // Featured Gallery State
  var featuredGalleryImageIDs : [Text] = [];

  // Review Image for review screenshots only
  type ReviewImage = {
    id : Text;
    image : Storage.ExternalBlob;
    caption : Text;
  };

  let reviewImages = Map.empty<Text, ReviewImage>();

  // User submitted review type
  type SubmittedReview = {
    id : Text;
    name : ?Text;
    content : Text;
    rating : Nat;
  };

  let submittedReviews = Map.empty<Text, SubmittedReview>();

  // Contact Information
  type ContactInfo = {
    phone : Text;
    instagram : Text;
    branches : [Text];
    ownerName : Text;
    email : Text;
    facebook : Text;
    whatsapp : Text;
  };

  // Include BLOB storage for images
  include MixinStorage();

  var contactInfo : ContactInfo = {
    phone = "+91 77991 51318";
    instagram = "@hr_academy_knr";
    branches = [
      "IB Chowrasta, City Centre, Christian Colony, Karimnagar",
      "Beside City Diamond, near Mahmoodia Masjid Kisan Nagar, Karimnagar",
    ];
    ownerName = "Haqeeb Raja Bahmood";
    email = "";
    facebook = "";
    whatsapp = "";
  };

  // International Student Inquiry
  type InternationalInquiry = {
    name : Text;
    email : Text;
    message : Text;
    country : Text;
  };

  let internationalInquiries = Map.empty<Text, InternationalInquiry>();

  // User Profile Type
  public type UserProfile = {
    name : Text;
    role : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // Access control state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Home page content with preview workflow
  var homePageContent : PreviewState<HomePageContent> = {
    draft = {
      heroTitle = "Welcome to HR Academy";
      heroSubtitle = "Trusted by 6000+ parents worldwide";
      missionStatement = "Empowering students with quality education";
      testimonialsHeading = "What Our Students Say";
      aboutText = "Learn more about our mission and values.";
      contactText = "Get in touch with us today.";
    };
    published = {
      heroTitle = "Welcome to HR Academy";
      heroSubtitle = "Trusted by 6000+ parents worldwide";
      missionStatement = "Empowering students with quality education";
      testimonialsHeading = "What Our Students Say";
      aboutText = "Learn more about our mission and values.";
      contactText = "Get in touch with us today.";
    };
    isPreviewMode = false;
  };

  public type BuildInfo = {
    build : Text;
    timestamp : Int;
  };

  var buildInfo : BuildInfo = {
    build = "v2.6.00021";
    timestamp = 1_714_932_466_781_582_353;
  };

  public query ({ caller }) func getBuildInfo() : async BuildInfo {
    buildInfo;
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Admin functions for owner management
  public shared ({ caller }) func addOrUpdateCourse(id : Text, name : Text, category : CourseCategory, description : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can add or update courses");
    };

    let course : Course = {
      id;
      name;
      category;
      description;
    };
    courses.add(id, course);
  };

  public shared ({ caller }) func removeCourse(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can remove courses");
    };
    courses.remove(id);
  };

  public shared ({ caller }) func addOrUpdateGalleryImage(id : Text, image : Storage.ExternalBlob, caption : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can add or update gallery images");
    };

    let galleryImage : GalleryImage = {
      id;
      image;
      caption;
    };
    galleryImages.add(id, galleryImage);
  };

  public shared ({ caller }) func removeGalleryImage(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can remove gallery images");
    };
    galleryImages.remove(id);
  };

  public shared ({ caller }) func setFeaturedGalleryImageIDs(imageIDs : [Text]) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can set featured images");
    };

    if (imageIDs.size() > 4) {
      Runtime.trap("Cannot feature more than 4 images");
    };

    let valid = imageIDs.foldLeft(
      true,
      func(acc, id) {
        switch (galleryImages.get(id)) {
          case (null) { false };
          case (_) { acc };
        };
      },
    );

    if (not valid) {
      Runtime.trap("One or more image IDs not present in gallery");
    };

    featuredGalleryImageIDs := imageIDs;
  };

  public shared ({ caller }) func updateContactInfo(phone : Text, instagram : Text, branches : [Text], ownerName : Text, email : Text, facebook : Text, whatsapp : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can update contact info");
    };
    contactInfo := {
      phone;
      instagram;
      branches;
      ownerName;
      email;
      facebook;
      whatsapp;
    };
  };

  public shared func submitInternationalInquiry(id : Text, name : Text, email : Text, message : Text, country : Text) : async () {
    // No authorization check - accessible to guests
    let inquiry : InternationalInquiry = {
      name;
      email;
      message;
      country;
    };
    internationalInquiries.add(id, inquiry);
  };

  public query ({ caller }) func getInternationalInquiries() : async [InternationalInquiry] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can view international inquiries");
    };
    internationalInquiries.values().toArray();
  };

  // Reviews functionality
  public shared ({ caller }) func addReviewImage(id : Text, image : Storage.ExternalBlob, caption : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can add review images");
    };
    let reviewImage : ReviewImage = {
      id;
      image;
      caption;
    };
    reviewImages.add(id, reviewImage);
  };

  public shared ({ caller }) func removeReviewImage(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can remove review images");
    };
    reviewImages.remove(id);
  };

  public shared func submitReview(id : Text, name : ?Text, content : Text, rating : Nat) : async () {
    let review : SubmittedReview = {
      id;
      name;
      content;
      rating;
    };
    submittedReviews.add(id, review);
  };

  public shared ({ caller }) func deleteReview(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete reviews");
    };
    submittedReviews.remove(id);
  };

  public query func getReviewImages() : async [ReviewImage] {
    // No authorization check - public access to review screenshots
    reviewImages.values().toArray();
  };

  public query ({ caller }) func getAllSubmittedReviews() : async [SubmittedReview] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can view all reviews");
    };
    submittedReviews.values().toArray();
  };

  public query func getSubmittedReviews() : async [SubmittedReview] {
    submittedReviews.values().toArray();
  };

  // Page Content Management
  public query func getHomePageContent(isPreview : Bool) : async HomePageContent {
    if (isPreview) {
      homePageContent.draft;
    } else {
      homePageContent.published;
    };
  };

  public shared ({ caller }) func updateHomePageContent(newContent : HomePageContent) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can update home page content");
    };
    // Update draft content only
    homePageContent := {
      homePageContent with
      draft = newContent;
    };
  };

  public shared ({ caller }) func publishHomePageContent() : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can publish home page content");
    };
    // Publish draft content
    homePageContent := {
      homePageContent with
      published = homePageContent.draft
    };
  };

  // Public query functions for core data
  public query func getCourses() : async [Course] {
    courses.values().toArray().sort();
  };

  public query func getGalleryImages() : async [GalleryImage] {
    galleryImages.values().toArray();
  };

  public query func getContactInfo() : async ContactInfo {
    contactInfo;
  };

  // Featured Gallery Queries
  public query func getFeaturedGalleryImageIDs() : async [Text] {
    featuredGalleryImageIDs;
  };

  public query func getFeaturedGalleryImages() : async [GalleryImage] {
    let tempImages = featuredGalleryImageIDs.map(
      func(id) {
        galleryImages.get(id);
      }
    );

    let filteredImages = tempImages.filter(
      func(img) { switch (img) { case (null) { false }; case (_) { true } } }
    );

    filteredImages.map(
      func(optImg) {
        switch (optImg) {
          case (?galleryImage) { galleryImage };
          case (null) {
            Runtime.trap("Unexpected null value in filtered array. Should never happen. ");
          };
        };
      }
    );
  };
};
