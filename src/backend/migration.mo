import Map "mo:core/Map";
import Text "mo:core/Text";
import Principal "mo:core/Principal";

module {
  type OldCourse = {
    id : Text;
    name : Text;
    category : {
      #Intermediate;
      #Engineering;
      #Pharmacy;
      #EntranceExam;
    };
    description : Text;
  };

  type OldSubmittedReview = {
    id : Text;
    name : ?Text;
    content : Text;
    rating : Nat;
  };

  type OldContactInfo = {
    phone : Text;
    instagram : Text;
    branches : [Text];
    ownerName : Text;
    email : Text;
    facebook : Text;
    whatsapp : Text;
  };

  type OldInternationalInquiry = {
    name : Text;
    email : Text;
    message : Text;
    country : Text;
  };

  type OldUserProfile = {
    name : Text;
    role : Text;
  };

  type OldActor = {
    courses : Map.Map<Text, OldCourse>;
    submittedReviews : Map.Map<Text, OldSubmittedReview>;
    contactInfo : OldContactInfo;
    internationalInquiries : Map.Map<Text, OldInternationalInquiry>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
  };

  type NewHomePageContent = {
    heroTitle : Text;
    heroSubtitle : Text;
    missionStatement : Text;
    testimonialsHeading : Text;
    aboutText : Text;
    contactText : Text;
  };

  type NewPreviewState<T> = {
    draft : T;
    published : T;
    isPreviewMode : Bool;
  };

  type NewActor = {
    courses : Map.Map<Text, OldCourse>;
    submittedReviews : Map.Map<Text, OldSubmittedReview>;
    contactInfo : OldContactInfo;
    internationalInquiries : Map.Map<Text, OldInternationalInquiry>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
    homePageContent : NewPreviewState<NewHomePageContent>;
  };

  public func run(old : OldActor) : NewActor {
    let defaultHomePageContent : NewHomePageContent = {
      heroTitle = "Welcome to HR Academy";
      heroSubtitle = "Your path to success starts here";
      missionStatement = "Empowering students with quality education";
      testimonialsHeading = "What Our Students Say";
      aboutText = "Learn more about our mission and values.";
      contactText = "Get in touch with us today.";
    };

    let previewState : NewPreviewState<NewHomePageContent> = {
      draft = defaultHomePageContent;
      published = defaultHomePageContent;
      isPreviewMode = false;
    };

    {
      old with
      homePageContent = previewState;
    };
  };
};
