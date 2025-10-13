// src/pages/YourVideosPage.jsx
import React, { useState, useEffect } from 'react';
import { getChannelVideos, deleteVideo } from '../api/videoService';
import VideoCard from '@/components/VideoCard';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";


const YourVideosPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoToDelete, setVideoToDelete] = useState(null);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // 3. Only run the fetch if the user ID exists
    if (user?._id) {
      const fetchUserVideos = async () => {
        try {
          // 4. Pass the user's ID to the service function
          const userVideos = await getChannelVideos(user._id);
          setVideos(userVideos);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchUserVideos();
    } else {
      // If there's no user, stop loading and show nothing.
      setLoading(false);
    }
  }, [user]); // 5. Re-run this effect if the user object changes

  const handleDeleteConfirm = async () => {
    if (!videoToDelete) return;

    try {
      await deleteVideo(videoToDelete);
      // Optimistically update the UI by removing the video from the local state
      setVideos(currentVideos => currentVideos.filter(v => v._id !== videoToDelete));
      toast.success("Video deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete video.");
    } finally {
      setVideoToDelete(null); // Close the dialog
    }
  };

  const handleCancelDelete = () => {
    setVideoToDelete(null);
  };


  if (loading) return <div className="p-4">Loading your videos...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Your Videos</h1>
      <div className="flex flex-col gap-4">
        {videos.length > 0 ? (
          videos.map(video => {
            // --- THIS IS THE ADAPTER LOGIC ---
            // We transform the data to the shape our VideoCard expects
            const videoCardProps = {
              id: video._id,
              title: video.title,
              thumbnailUrl: video.thumbnailUrl,
              views: video.views,
              postedAt: new Date(video.createdAt).toLocaleDateString(),
              channel: {
                name: video.uploader.username,
                avatarUrl: video.uploader.profileImg || null,
              }
            };

            return (
              <div key={video._id} className="flex items-center gap-4 border-b pb-4">
                <div className="flex-1">
                  <VideoCard video={videoCardProps} layout="list" />
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Link to={`/edit-video/${video._id}`}>
                    <Button variant="outline" size="sm" className="w-full flex items-center gap-2">
                      <Pencil className="h-4 w-4" /> <span>Edit</span>
                    </Button>
                  </Link>
                  <Button variant="destructive" size="sm" className="flex items-center gap-2" onClick={() => setVideoToDelete(video._id)}>
                    <Trash2 className="h-4 w-4" /> <span>Delete</span>
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <p>You haven't uploaded any videos yet.</p>
        )}
      </div>
      {/* Confirmation Dialog */}
      <AlertDialog open={!!videoToDelete} onOpenChange={() => setVideoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your video and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default YourVideosPage;