// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { uploadVideo, resetUploadState } from '../store/uploadSlice';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { Badge } from '@/components/ui/badge';
// import { Progress } from '@/components/ui/progress';
// import { UploadCloud, X, CheckCircle } from 'lucide-react';

// const UploadPage = () => {
//   // State for all form fields
//   const [videoFile, setVideoFile] = useState(null);
//   const [thumbnailFile, setThumbnailFile] = useState(null);
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [tags, setTags] = useState([]);
//   const [currentTag, setCurrentTag] = useState('');

//   const dispatch = useDispatch();
//   const navigate = useNavigate();
  
//   // Get upload status from the Redux store
//   const { status, progress, error } = useSelector((state) => state.upload);

//   // Reset the upload state when the user leaves this page
//   useEffect(() => {
//     return () => {
//       dispatch(resetUploadState());
//     };
//   }, [dispatch]);

//   // --- FILE VALIDATION LOGIC ---
//   const MAX_VIDEO_SIZE_MB = 100;
//   const MAX_THUMBNAIL_SIZE_MB = 10;
  
//   const handleFileChange = (e, fileType) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const fileSizeMB = file.size / (1024 * 1024);

//     if (fileType === 'video') {
//       if (fileSizeMB > MAX_VIDEO_SIZE_MB) {
//         alert(`Video file size exceeds the ${MAX_VIDEO_SIZE_MB}MB limit.`);
//         e.target.value = null;
//         return;
//       }
//       setVideoFile(file);
//     } else if (fileType === 'thumbnail') {
//       if (fileSizeMB > MAX_THUMBNAIL_SIZE_MB) {
//         alert(`Thumbnail file size exceeds the ${MAX_THUMBNAIL_SIZE_MB}MB limit.`);
//         e.target.value = null;
//         return;
//       }
//       setThumbnailFile(file);
//     }
//   };

//   // --- TAG HANDLING LOGIC ---
//   const handleTagKeyDown = (e) => {
//     if (e.key === 'Enter' || e.key === ',') {
//       e.preventDefault();
//       const newTag = currentTag.trim();
//       if (newTag && !tags.includes(newTag)) {
//         setTags([...tags, newTag]);
//       }
//       setCurrentTag('');
//     }
//   };

//   const removeTag = (tagToRemove) => {
//     setTags(tags.filter(tag => tag !== tagToRemove));
//   };

//   // --- FORM SUBMISSION ---
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!videoFile || !thumbnailFile) {
//       alert("Please select both a video and a thumbnail file.");
//       return;
//     }
//     const videoData = { title, description, tags, videoFile, thumbnailFile };
//     dispatch(uploadVideo(videoData)).then((result) => {
//       if (uploadVideo.fulfilled.match(result)) {
//         // On successful upload, navigate to the new video's watch page
//         navigate(`/watch/${result.payload._id}`);
//       }
//     });
//   };

//   return (
//     <div className="container mx-auto max-w-4xl py-8">
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-2xl">Upload Video</CardTitle>
//           <CardDescription>Select files and enter details for your new video.</CardDescription>
//         </CardHeader>
//         <CardContent>
//           {/* Conditional rendering based on upload status */}
//           {status === 'uploading' ? (
//             <div className="flex flex-col items-center justify-center gap-4 py-16">
//               <p className="text-lg font-semibold">Uploading... {progress}%</p>
//               <Progress value={progress} className="w-full" />
//             </div>
//           ) : status === 'success' ? (
//             <div className="flex flex-col items-center justify-center gap-4 py-16">
//               <CheckCircle className="h-16 w-16 text-green-500" />
//               <p className="text-lg font-semibold">Upload Successful!</p>
//               <Button onClick={() => dispatch(resetUploadState())}>Upload Another Video</Button>
//             </div>
//           ) : (
//             <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-8">
//               {/* Left Column: File Inputs */}
//               <div className="grid gap-6">
//                 <div className="grid gap-2">
//                   <Label htmlFor="video-file">Video File (Max {MAX_VIDEO_SIZE_MB}MB)</Label>
//                   <label htmlFor="video-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
//                     <div className="text-center">
//                       <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
//                       <p className="mt-2 text-sm text-gray-500">{videoFile ? videoFile.name : 'Click to select or drag and drop'}</p>
//                     </div>
//                     <Input id="video-file" type="file" className="sr-only" accept="video/mp4,video/mkv" onChange={(e) => handleFileChange(e, 'video')} required />
//                   </label>
//                 </div>
//                 <div className="grid gap-2">
//                   <Label htmlFor="thumbnail-file">Thumbnail (Max {MAX_THUMBNAIL_SIZE_MB}MB)</Label>
//                   <label htmlFor="thumbnail-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
//                     <div className="text-center">
//                       <UploadCloud className="mx-auto h-8 w-8 text-gray-400" />
//                       <p className="mt-2 text-sm text-gray-500">{thumbnailFile ? thumbnailFile.name : 'Select an image'}</p>
//                     </div>
//                     <Input id="thumbnail-file" type="file" className="sr-only" accept="image/jpeg,image/png" onChange={(e) => handleFileChange(e, 'thumbnail')} required />
//                   </label>
//                 </div>
//               </div>

//               {/* Right Column: Text Inputs */}
//               <div className="grid gap-6">
//                 <div className="grid gap-2">
//                   <Label htmlFor="title">Title</Label>
//                   <Input id="title" placeholder="My awesome video" value={title} onChange={(e) => setTitle(e.target.value)} required />
//                 </div>
//                 <div className="grid gap-2">
//                   <Label htmlFor="description">Description</Label>
//                   <Textarea id="description" placeholder="A description of my video..." value={description} onChange={(e) => setDescription(e.target.value)} required className="min-h-[100px]" />
//                 </div>
//                 <div className="grid gap-2">
//                   <Label htmlFor="tags">Tags</Label>
//                   <Input id="tags" placeholder="Press Enter or comma to add a tag" value={currentTag} onChange={(e) => setCurrentTag(e.target.value)} onKeyDown={handleTagKeyDown} />
//                   <div className="flex flex-wrap gap-2 mt-2">
//                     {tags.map((tag, index) => (
//                       <Badge key={index} variant="secondary" className="flex items-center gap-1">
//                         {tag}
//                         <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
//                       </Badge>
//                     ))}
//                   </div>
//                 </div>
//                 <Button type="submit" className="w-full lg:w-auto justify-self-end" disabled={status === 'uploading'}>
//                   {status === 'uploading' ? 'Uploading...' : 'Upload'}
//                 </Button>
//               </div>
//             </form>
//           )}
//           {status === 'failed' && <p className="text-red-500 mt-4 text-center">Upload failed: {error}</p>}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default UploadPage;

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { uploadVideo, resetUploadState } from '../store/uploadSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { UploadCloud, X, CheckCircle } from 'lucide-react';

const UploadPage = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, progress, error } = useSelector((state) => state.upload);

  useEffect(() => {
    return () => {
      dispatch(resetUploadState());
    };
  }, [dispatch]);

  const MAX_VIDEO_SIZE_MB = 100;
  const MAX_THUMBNAIL_SIZE_MB = 10;

   const processFile = (file, fileType) => {
    if (!file) return;

    // --- NEW: FILE TYPE VALIDATION ---
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/mkv'];
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];

    let isValidType = false;
    if (fileType === 'video') {
      isValidType = allowedVideoTypes.includes(file.type);
      if (!isValidType) {
        alert('Invalid file type. Please select a valid video file (MP4, WebM, MKV).');
      }
    } else if (fileType === 'thumbnail') {
      isValidType = allowedImageTypes.includes(file.type);
      if (!isValidType) {
        alert('Invalid file type. Please select a valid image file (JPG, PNG, WebP).');
      }
    }

    if (!isValidType) {
      // If the type is invalid, we stop here and don't process the file.
      return; 
    }
    // --- END OF NEW VALIDATION ---
    
    // --- Existing File Size Validation ---
    const fileSizeMB = file.size / (1024 * 1024);
    let maxSizeMB, setter;

    if (fileType === 'video') {
      maxSizeMB = MAX_VIDEO_SIZE_MB;
      setter = setVideoFile;
    } else {
      maxSizeMB = MAX_THUMBNAIL_SIZE_MB;
      setter = setThumbnailFile;
    }

    if (fileSizeMB > maxSizeMB) {
      alert(`File size exceeds the ${maxSizeMB}MB limit.`);
      return;
    }
    setter(file);
  };
  const handleFileChange = (e, fileType) => {
    processFile(e.target.files[0], fileType);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e, fileType) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0], fileType);
    }
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = currentTag.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!videoFile || !thumbnailFile) {
      alert("Please select both a video and a thumbnail file.");
      return;
    }
    const videoData = { title, description, tags, videoFile, thumbnailFile };
    dispatch(uploadVideo(videoData)).then((result) => {
      if (uploadVideo.fulfilled.match(result)) {
        navigate(`/watch/${result.payload._id}`);
      }
    });
  };

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Upload Video</CardTitle>
          <CardDescription>Select files and enter details for your new video.</CardDescription>
        </CardHeader>
        <CardContent>
          {status === 'uploading' ? (
            <div className="flex flex-col items-center justify-center gap-4 py-16">
              <p className="text-lg font-semibold">Uploading... {progress}%</p>
              <Progress value={progress} className="w-full" />
            </div>
          ) : status === 'success' ? (
            <div className="flex flex-col items-center justify-center gap-4 py-16">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <p className="text-lg font-semibold">Upload Successful!</p>
              <Button onClick={() => dispatch(resetUploadState())}>Upload Another Video</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-8">
              {/* Left Column: File Inputs */}
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="video-file">Video File (Max {MAX_VIDEO_SIZE_MB}MB)</Label>
                  <label htmlFor="video-file" className={`flex flex-col items-center justify-center w-full h-48 border-2 ${isDragging ? 'border-blue-500' : 'border-dashed'} rounded-lg cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-800`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={(e) => handleDrop(e, 'video')}>
                    <div className="text-center">
                      <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">{videoFile ? videoFile.name : 'Click to select or drag and drop'}</p>
                    </div>
                    <Input id="video-file" type="file" className="sr-only" accept="video/mp4,video/mkv" onChange={(e) => handleFileChange(e, 'video')} />
                  </label>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="thumbnail-file">Thumbnail (Max {MAX_THUMBNAIL_SIZE_MB}MB)</Label>
                  <label htmlFor="thumbnail-file" className={`flex flex-col items-center justify-center w-full h-32 border-2 ${isDragging ? 'border-blue-500' : 'border-dashed'} rounded-lg cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-800`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={(e) => handleDrop(e, 'thumbnail')}>
                    <div className="text-center">
                      <UploadCloud className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">{thumbnailFile ? thumbnailFile.name : 'Select an image'}</p>
                    </div>
                    <Input id="thumbnail-file" type="file" className="sr-only" accept="image/jpeg,image/png" onChange={(e) => handleFileChange(e, 'thumbnail')} />
                  </label>
                </div>
              </div>

              {/* Right Column: Text Inputs */}
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="My awesome video" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="A description of my video..." value={description} onChange={(e) => setDescription(e.target.value)} required className="min-h-[100px]" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input id="tags" placeholder="Press Enter or comma to add a tag" value={currentTag} onChange={(e) => setCurrentTag(e.target.value)} onKeyDown={handleTagKeyDown} />
                  <div className="flex flex-wrap gap-2 mt-2 min-h-[2.5rem]">
                    {tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1 cursor-pointer" onClick={() => removeTag(tag)}>
                        {tag}
                        <X className="h-3 w-3" />
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button type="submit" className="w-full lg:w-auto justify-self-end" disabled={status === 'uploading'}>
                  {status === 'uploading' ? 'Uploading...' : 'Upload'}
                </Button>
              </div>
            </form>
          )}
          {status === 'failed' && <p className="text-red-500 mt-4 text-center">Upload failed: {error}</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadPage;