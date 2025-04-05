
import React, { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { toast } from "sonner";

interface ProfilePictureUploadProps {
  initialImage?: string;
  onImageChange?: (imageUrl: string) => void;
}

export function ProfilePictureUpload({ 
  initialImage = "/placeholder.svg", 
  onImageChange 
}: ProfilePictureUploadProps) {
  const [imageUrl, setImageUrl] = useState(initialImage);
  
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.match('image.*')) {
      toast.error('Please select an image file');
      return;
    }
    
    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImageUrl(result);
      if (onImageChange) {
        onImageChange(result);
      }
      toast.success('Profile picture updated');
    };
    reader.readAsDataURL(file);
  };
  
  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-32 w-32 relative group">
        <AvatarImage src={imageUrl} alt="Profile" />
        <AvatarFallback className="text-3xl">
          {imageUrl === "/placeholder.svg" ? "GK" : ""}
        </AvatarFallback>
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
          <Camera className="h-8 w-8 text-white" />
        </div>
      </Avatar>
      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={() => document.getElementById('profile-picture-input')?.click()}
          className="relative"
        >
          Change Picture
          <input
            id="profile-picture-input"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleImageChange}
          />
        </Button>
      </div>
    </div>
  );
}
