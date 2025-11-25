import { Image, Plus, Calendar, Users, Download, Share2, Heart } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner@2.0.3";

interface PhotoGalleryScreenProps {
  onBack: () => void;
}

interface Photo {
  id: string;
  url: string;
  caption: string;
  date: string;
  uploadedBy: string;
  event: string;
  likes: number;
  isLiked: boolean;
}

interface Album {
  id: string;
  title: string;
  date: string;
  photoCount: number;
  coverPhoto: string;
}

export function PhotoGalleryScreen({ onBack }: PhotoGalleryScreenProps) {
  const [selectedTab, setSelectedTab] = useState<"photos" | "albums">("photos");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const albums: Album[] = [
    {
      id: "a1",
      title: "Championship Finals 2024",
      date: "Dec 15, 2024",
      photoCount: 24,
      coverPhoto: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400",
    },
    {
      id: "a2",
      title: "Team Social Event",
      date: "Nov 28, 2024",
      photoCount: 18,
      coverPhoto: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400",
    },
    {
      id: "a3",
      title: "Season Opener",
      date: "Oct 10, 2024",
      photoCount: 15,
      coverPhoto: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400",
    },
  ];

  const photos: Photo[] = [
    {
      id: "p1",
      url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400",
      caption: "Championship celebration! 🏆",
      date: "Dec 15, 2024",
      uploadedBy: "Alex Rivera",
      event: "Championship Finals",
      likes: 24,
      isLiked: true,
    },
    {
      id: "p2",
      url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400",
      caption: "Great team effort tonight",
      date: "Dec 12, 2024",
      uploadedBy: "Jordan Chen",
      event: "Regular Season",
      likes: 18,
      isLiked: false,
    },
    {
      id: "p3",
      url: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400",
      caption: "Pre-match warm up",
      date: "Dec 10, 2024",
      uploadedBy: "Sam Martinez",
      event: "Regular Season",
      likes: 15,
      isLiked: true,
    },
    {
      id: "p4",
      url: "https://images.unsplash.com/photo-1530915365347-e35b749a0381?w=400",
      caption: "Team bonding session",
      date: "Nov 28, 2024",
      uploadedBy: "Taylor Kim",
      event: "Team Social",
      likes: 32,
      isLiked: false,
    },
    {
      id: "p5",
      url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400",
      caption: "Practice makes perfect",
      date: "Nov 20, 2024",
      uploadedBy: "Morgan Lee",
      event: "Practice",
      likes: 12,
      isLiked: true,
    },
    {
      id: "p6",
      url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400",
      caption: "Victory formation! 💪",
      date: "Nov 15, 2024",
      uploadedBy: "Alex Rivera",
      event: "Regular Season",
      likes: 28,
      isLiked: false,
    },
  ];

  const handleLike = (photoId: string) => {
    toast.success("Photo liked!");
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <div className="bg-[var(--color-bg-elevated)] border-b border-[var(--color-border)] p-4 sticky top-0 z-20">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="text-[var(--color-text-secondary)]">
            ← Back
          </button>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="mb-1">Photo Gallery</h1>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Team memories and highlights
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => toast.info("Upload photo feature coming soon!")}
          >
            <Plus className="w-4 h-4 mr-1" />
            Upload
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setSelectedTab("photos")}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              selectedTab === "photos"
                ? "bg-white text-[var(--color-primary)] shadow-sm"
                : "text-[var(--color-text-secondary)]"
            }`}
          >
            All Photos ({photos.length})
          </button>
          <button
            onClick={() => setSelectedTab("albums")}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              selectedTab === "albums"
                ? "bg-white text-[var(--color-primary)] shadow-sm"
                : "text-[var(--color-text-secondary)]"
            }`}
          >
            Albums ({albums.length})
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {selectedTab === "albums" ? (
          /* Albums View */
          <div className="space-y-3">
            {albums.map((album, index) => (
              <motion.button
                key={album.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  setSelectedTab("photos");
                  toast.info(`Viewing ${album.title}`);
                }}
                className="w-full bg-[var(--color-bg-elevated)] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all text-left"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={album.coverPhoto}
                    alt={album.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-black/50 text-white backdrop-blur-sm">
                      {album.photoCount} photos
                    </Badge>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-1">{album.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                    <Calendar className="w-4 h-4" />
                    {album.date}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          /* Photos Grid */
          <div className="grid grid-cols-2 gap-3">
            {photos.map((photo, index) => (
              <motion.button
                key={photo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => setSelectedPhoto(photo)}
                className="aspect-square rounded-2xl overflow-hidden relative group"
              >
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-white text-xs font-medium truncate">
                      {photo.caption}
                    </p>
                  </div>
                </div>
                <div className="absolute top-2 right-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(photo.id);
                    }}
                    className={`w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center ${
                      photo.isLiked
                        ? "bg-red-500 text-white"
                        : "bg-black/30 text-white"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${photo.isLiked ? "fill-current" : ""}`} />
                  </button>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Photo Detail Modal */}
      {selectedPhoto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="relative">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.caption}
                className="w-full aspect-square object-cover"
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-medium mb-1">{selectedPhoto.caption}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-1">
                    {selectedPhoto.event}
                  </p>
                  <p className="text-xs text-[var(--color-text-tertiary)]">
                    Uploaded by {selectedPhoto.uploadedBy} • {selectedPhoto.date}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Heart className={`w-4 h-4 ${selectedPhoto.isLiked ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                  <span>{selectedPhoto.likes}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => toast.success("Photo downloaded!")}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => toast.success("Photo shared!")}
                >
                  <Share2 className="w-4 h-4 mr-1" />
                  Share
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
