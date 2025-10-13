// src/pages/EditVideoPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVideoById, updateVideoDetails } from '../api/videoService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const EditVideoPage = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [newThumbnail, setNewThumbnail] = useState(null);
  const [isPublished, setIsPublished] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch the current video data to pre-fill the form
  useEffect(() => {
    getVideoById(videoId)
      .then(data => {
        setVideo(data);
        setTitle(data.title);
        setDescription(data.description);
        setIsPublished(data.isPublished);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [videoId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    const updateData = {
      title,
      description,
      isPublished,
    };
    if (newThumbnail) {
      updateData.thumbnail = newThumbnail;
    }

    try {
      await updateVideoDetails(videoId, updateData);
      toast("Video updated successfully!");
      navigate('/your-videos'); // Go back to the list of videos
    } catch (error) {
      toast.error("Failed to update video.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return <div>Loading editor...</div>;
  if (!video) return <div>Video not found.</div>;

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit Video</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required className="min-h-[120px]" />
            </div>
            <div className="grid gap-2">
              <Label>Current Thumbnail</Label>
              <img src={video.thumbnailUrl} alt="Current thumbnail" className="rounded-lg max-h-48" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="thumbnail-file">Upload New Thumbnail</Label>
              <Input id="thumbnail-file" type="file" accept="image/*" onChange={(e) => setNewThumbnail(e.target.files[0])} />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="isPublished" checked={isPublished} onCheckedChange={setIsPublished} />
              <Label htmlFor="isPublished">Published</Label>
            </div>
            <Button type="submit" className="w-full" disabled={isUpdating}>
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditVideoPage;