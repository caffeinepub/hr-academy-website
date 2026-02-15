import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetGalleryImages } from '@/hooks/useQueries';

export default function HomeGallerySection() {
  const { data: galleryImages = [], isLoading } = useGetGalleryImages();

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-900">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
            Our <span className="text-accent-red">Gallery</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg bg-gray-800" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (galleryImages.length === 0) {
    return (
      <section className="py-16 bg-gray-900">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
            Our <span className="text-accent-red">Gallery</span>
          </h2>
          <Card className="bg-gray-800 border-accent-red/20 p-12">
            <p className="text-center text-gray-400 text-lg">
              Gallery images will appear here soon
            </p>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-900">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
          Our <span className="text-accent-red">Gallery</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryImages.map((image) => (
            <div key={image.id} className="relative group overflow-hidden rounded-lg">
              <img
                src={image.image.getDirectURL()}
                alt={image.caption}
                className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white text-sm font-medium">{image.caption}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
