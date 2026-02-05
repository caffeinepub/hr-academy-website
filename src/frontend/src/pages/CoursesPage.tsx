import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGetCourses } from '@/hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { CourseCategory } from '@/backend';

export default function CoursesPage() {
  const { data: courses, isLoading } = useGetCourses();

  const getCategoryColor = (category: CourseCategory) => {
    switch (category) {
      case CourseCategory.Intermediate:
        return 'bg-accent-red-light/10 text-accent-red-light border-accent-red-light/20';
      case CourseCategory.Engineering:
        return 'bg-accent-red-dark/10 text-accent-red-dark border-accent-red-dark/20';
      case CourseCategory.Pharmacy:
        return 'bg-white/10 text-white border-white/20';
      case CourseCategory.EntranceExam:
        return 'bg-accent-red/10 text-accent-red border-accent-red/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getCategoryTitle = (category: CourseCategory) => {
    switch (category) {
      case CourseCategory.Intermediate:
        return 'Intermediate (M.P.C/Bi.P.C)';
      case CourseCategory.Engineering:
        return 'Engineering Entrance';
      case CourseCategory.Pharmacy:
        return 'Pharmacy Entrance';
      case CourseCategory.EntranceExam:
        return 'Competitive Exams (Medicine, Business)';
      default:
        return category;
    }
  };

  const groupedCourses = courses?.reduce((acc, course) => {
    const category = course.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(course);
    return acc;
  }, {} as Record<CourseCategory, typeof courses>);

  const categoryOrder = [
    CourseCategory.Intermediate,
    CourseCategory.EntranceExam,
    CourseCategory.Engineering,
    CourseCategory.Pharmacy,
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-16">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            What Courses We <span className="text-accent-red">Offer</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Comprehensive coaching programs for Intermediate boards and competitive entrance exams
          </p>
        </div>

        {/* Courses by Category */}
        {isLoading ? (
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-8 w-64 bg-gray-800" />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((j) => (
                    <Skeleton key={j} className="h-32 bg-gray-800" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {categoryOrder.map((category) => {
              const categoryCourses = groupedCourses?.[category];
              if (!categoryCourses || categoryCourses.length === 0) return null;

              return (
                <div key={category} className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <Badge 
                      variant="outline" 
                      className={`text-lg px-4 py-2 ${getCategoryColor(category)}`}
                    >
                      {getCategoryTitle(category)}
                    </Badge>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {categoryCourses.map((course, index) => (
                      <Card 
                        key={index} 
                        className="bg-gray-800 border-accent-red/20 hover:border-accent-red/50 transition-all hover:shadow-lg hover:shadow-accent-red/10"
                      >
                        <CardHeader>
                          <CardTitle className="text-white">{course.name}</CardTitle>
                        </CardHeader>
                        {course.description && (
                          <CardContent>
                            <p className="text-gray-400 text-sm">{course.description}</p>
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && (!courses || courses.length === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No courses available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
