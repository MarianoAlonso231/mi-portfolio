import { useState, useCallback, useEffect } from "react";
import { projects } from "@/lib/data";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Github, ChevronLeft, ChevronRight, X } from "lucide-react";
import { GlassCard } from "./ui/glass-card";
import MotionWrapper from "./MotionWrapper";
import { motion, AnimatePresence } from "framer-motion";

const Lightbox = ({ 
  image, 
  onClose 
}: { 
  image: string; 
  onClose: () => void;
}) => {
  // Cerrar con ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 500 }}
        className="relative max-w-[90vw] max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-purple-400 transition-colors z-10 p-2"
        >
          <X className="h-6 w-6" />
        </button>
        <img
          src={image}
          alt="Vista ampliada"
          className="max-w-full max-h-[90vh] object-contain rounded-lg"
        />
      </motion.div>
    </motion.div>
  );
};

const ImageCarousel = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  // Si no hay imágenes, usar imágenes de ejemplo
  const defaultImages = [
    "/coratone-dashboard.png",
    "/coratone-carrito.png",
    "/coratone-admin.png",
  ];
  
  const imagesToUse = images && images.length > 0 ? images : defaultImages;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === imagesToUse.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? imagesToUse.length - 1 : prevIndex - 1
    );
  };

  const handleImageClick = () => {
    setShowLightbox(true);
  };

  const handleCloseLightbox = () => {
    setShowLightbox(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <>
      <div className="relative w-full h-48 md:h-64 mb-4 group">
        <img
          src={imagesToUse[currentIndex]}
          alt={`Proyecto vista ${currentIndex + 1} de ${imagesToUse.length}`}
          className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
          onClick={handleImageClick}
          onError={(e) => {
            // Fallback a una imagen placeholder si falla
            e.currentTarget.src = "https://via.placeholder.com/400x300/1a1b23/ffffff?text=Imagen+no+disponible";
          }}
        />
        
        {/* Navegación solo si hay más de una imagen */}
        {imagesToUse.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
            >
              <ChevronLeft className="h-4 w-4 text-white" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
            >
              <ChevronRight className="h-4 w-4 text-white" />
            </button>

            {/* Indicadores */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
              {imagesToUse.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    goToSlide(index);
                  }}
                  className={`h-2 rounded-full transition-all duration-200 ${
                    currentIndex === index 
                      ? "bg-white w-4" 
                      : "bg-white/50 w-2 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-lg pointer-events-none">
          <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            Click para ampliar ({currentIndex + 1}/{imagesToUse.length})
          </span>
        </div>
      </div>

      <AnimatePresence>
        {showLightbox && (
          <Lightbox
            image={imagesToUse[currentIndex]}
            onClose={handleCloseLightbox}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default function ProjectsSection() {
  return (
    <section id="projects" className="py-12 relative">
      <div className="container max-w-4xl mx-auto px-6 md:px-4">
        <MotionWrapper>
          <h2 className="text-2xl font-bold mb-8 text-center md:text-left">
            🚀 Proyectos
          </h2>
        </MotionWrapper>

        <div className="grid grid-cols-1 gap-8">
          {projects.map((project, index) => (
            <MotionWrapper key={project.title} delay={index * 0.2}>
              <GlassCard className="group overflow-hidden dark:border-purple-500/10">
                <CardHeader className="bg-gradient-to-r from-purple-500/5 to-pink-500/5">
                  <CardTitle className="text-center md:text-left group-hover:text-purple-500 transition-colors duration-300">
                    {project.title}
                  </CardTitle>
                </CardHeader>
                
                {/* Siempre mostrar el carrusel con imágenes por defecto si no hay imágenes del proyecto */}
                <ImageCarousel images={project.images || []} />

                <CardContent>
                  <ul className="list-disc ml-4 space-y-1 text-sm">
                    {project.description.map((desc, i) => (
                      <motion.li
                        key={i}
                        className="text-muted-foreground"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                      >
                        {desc}
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="flex justify-center md:justify-start items-center border-t border-border/30 bg-gradient-to-r from-purple-500/5 to-pink-500/5">
                  <motion.a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-muted-foreground hover:text-purple-500 transition-colors group/link"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Github className="h-4 w-4 mr-2 group-hover/link:rotate-12 transition-transform duration-300" />
                    Ver en GitHub 🔗
                  </motion.a>
                </CardFooter>
              </GlassCard>
            </MotionWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}