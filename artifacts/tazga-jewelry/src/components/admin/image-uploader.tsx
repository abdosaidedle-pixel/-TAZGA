import { useState, useRef } from "react";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadImageToStorage } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  folder?: string;
}

export function ImageUploader({ images, onChange, folder = "products" }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const uploaded: string[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        toast({ title: "نوع الملف غير مدعوم", description: "يرجى رفع صور فقط", variant: "destructive" });
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast({ title: "الملف كبير جداً", description: "الحد الأقصى 10MB", variant: "destructive" });
        continue;
      }
      try {
        const path = `${folder}/${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
        const url = await uploadImageToStorage(file, path);
        uploaded.push(url);
      } catch (err) {
        toast({ title: "فشل رفع الصورة", description: String(err), variant: "destructive" });
      }
    }

    if (uploaded.length > 0) {
      onChange([...images, ...uploaded]);
      toast({ title: `تم رفع ${uploaded.length} صورة بنجاح` });
    }
    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (idx: number) => {
    const next = [...images];
    next.splice(idx, 1);
    onChange(next);
  };

  const moveImage = (from: number, to: number) => {
    const next = [...images];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed border-border rounded-md p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>جاري رفع الصور على Firebase Storage...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Upload className="h-8 w-8" />
            <p className="font-medium">اسحب الصور هنا أو اضغط للاختيار</p>
            <p className="text-xs">PNG, JPG, WebP — حتى 10MB لكل صورة</p>
          </div>
        )}
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {images.map((url, idx) => (
            <div key={url + idx} className="group relative aspect-square rounded-md overflow-hidden border border-border bg-secondary">
              <img
                src={url}
                alt={`صورة ${idx + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = ""; }}
              />
              {idx === 0 && (
                <span className="absolute top-1 left-1 text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded font-bold">
                  رئيسية
                </span>
              )}
              <div className="absolute inset-0 bg-background/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="h-7 w-7 rounded-full"
                  onClick={() => removeImage(idx)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
                {idx > 0 && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-6 text-[10px] px-2"
                    onClick={() => moveImage(idx, 0)}
                  >
                    جعلها رئيسية
                  </Button>
                )}
              </div>
            </div>
          ))}
          <div
            className="aspect-square rounded-md border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => inputRef.current?.click()}
          >
            <ImageIcon className="h-6 w-6 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  );
}
