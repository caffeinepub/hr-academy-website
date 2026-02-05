import { useGetGalleryImages } from '@/hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';

export default function GalleryPage() {
  const { data: images, isLoading } = useGetGalleryImages();

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-16">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Our <span className="text-accent-red">Gallery</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Glimpses of our vibrant learning environment, student achievements, and memorable moments
          </p>
        </div>

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-64 bg-gray-800 rounded-lg" />
            ))}
          </div>
        ) : images && images.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {images.map((image, index) => (
              <div 
                key={index} 
                className="group relative overflow-hidden rounded-lg bg-gray-800 border border-accent-red/20 hover:border-accent-red/50 transition-all"
              >
                <img 
                  src={image.image.getDirectURL()} 
                  alt={image.caption} 
                  className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                />
                {image.caption && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                    <p className="text-white p-4 text-sm">{image.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 space-y-6">
            <p className="text-gray-400 text-lg">Gallery images will be available soon.</p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="relative overflow-hidden rounded-lg border border-accent-red/20">
                <img 
                  src="/assets/generated/classroom-session.dim_800x600.jpg" 
                  alt="Classroom Session" 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
                  <p className="text-white p-4 text-sm">Interactive classroom sessions</p>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-lg border border-accent-red/20">
                <img 
                  src="/assets/generated/student-success.dim_800x600.jpg" 
                  alt="Student Success" 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
                  <p className="text-white p-4 text-sm">Celebrating student achievements</p>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-lg border border-accent-red/20">
                <img 
                  src="/assets/generated/academy-building.dim_800x600.jpg" 
                  alt="Academy Building" 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
                  <p className="text-white p-4 text-sm">Our modern learning facilities</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
