import { useState, useEffect, useRef } from "react";
import { mediaService } from "@/lib/services/media.service";
import type { MediaFile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Upload, Trash2, Copy, ImageIcon, Loader2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { EmptyState } from "@/components/admin/empty-state";
import { Input } from "@/components/ui/input";

export default function AdminMedia() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; storagePath: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const unsub = mediaService.subscribeAll((data) => {
      setMediaFiles(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: "تم نسخ الرابط", description: "تم نسخ رابط الصورة إلى الحافظة بنجاح." });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await mediaService.delete(deleteTarget.id, deleteTarget.storagePath);
      toast({ title: "تم الحذف", description: "تم حذف الملف من قاعدة البيانات ومساحة التخزين." });
    } catch (err) {
      toast({ title: "فشل الحذف", description: String(err), variant: "destructive" });
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadProgress([]);

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        toast({ title: "نوع الملف غير مدعوم", description: "يرجى رفع صور فقط.", variant: "destructive" });
        continue;
      }
      if (file.size > 15 * 1024 * 1024) {
        toast({ title: `${file.name} كبير جداً`, description: "الحد الأقصى لحجم الملف هو 15MB.", variant: "destructive" });
        continue;
      }

      setUploadProgress(prev => [...prev, `جاري رفع ${file.name}...`]);

      try {
        await mediaService.upload(file, "media");
        setUploadProgress(prev => prev.map(p =>
          p.includes(file.name) ? `✅ ${file.name} — تم الرفع` : p
        ));
      } catch (err) {
        setUploadProgress(prev => prev.map(p =>
          p.includes(file.name) ? `❌ ${file.name} — فشل الرفع` : p
        ));
        toast({ title: `فشل رفع ${file.name}`, description: String(err), variant: "destructive" });
      }
    }

    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
    setTimeout(() => setUploadProgress([]), 4000);
  };

  const formatSize = (bytes?: number | null) => {
    if (!bytes) return "—";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (timestamp?: any) => {
    if (!timestamp) return "—";
    try {
      const date = typeof timestamp.toDate === 'function' ? timestamp.toDate() : new Date(timestamp);
      return format(date, "dd/MM/yyyy");
    } catch {
      return "—";
    }
  };

  const filteredMedia = mediaFiles.filter((file) =>
    file.filename.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif tracking-wider mb-2">مكتبة الوسائط</h1>
          <p className="text-muted-foreground font-arabic">رفع وإدارة صور المنتجات والمحتوى على Firebase Storage</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleUpload(e.target.files)}
          />
          <Button
            className="bg-primary text-primary-foreground font-arabic w-full sm:w-auto"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Upload className="ml-2 h-4 w-4" />}
            {uploading ? "جاري الرفع..." : "رفع صور"}
          </Button>
        </div>
      </div>

      <div className="flex items-center relative max-w-md">
        <Search className="absolute right-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="ابحث باسم الملف..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-card border-border pr-9 font-arabic"
        />
      </div>

      {uploadProgress.length > 0 && (
        <div className="bg-card border border-border rounded-md p-4 space-y-1 font-arabic">
          {uploadProgress.map((msg, i) => (
            <p key={i} className="text-sm text-muted-foreground">{msg}</p>
          ))}
        </div>
      )}

      <div
        className="border-2 border-dashed border-border rounded-md p-10 text-center cursor-pointer hover:border-primary/50 transition-colors"
        onClick={() => !uploading && inputRef.current?.click()}
        onDrop={(e) => { e.preventDefault(); handleUpload(e.dataTransfer.files); }}
        onDragOver={(e) => e.preventDefault()}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2 text-muted-foreground font-arabic">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>جاري الرفع على Firebase Storage...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground font-arabic">
            <Upload className="h-8 w-8" />
            <p className="font-medium">اسحب الصور هنا أو اضغط للاختيار</p>
            <p className="text-xs">PNG, JPG, WebP — حتى 15MB لكل صورة</p>
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array(10).fill(0).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-square w-full rounded-md" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      ) : filteredMedia.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="لا توجد صور"
          description={search ? "لم يتم العثور على صور تطابق بحثك." : "ارفع صوراً لاستخدامها في المنتجات والبنرات."}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredMedia.map((file) => (
            <div key={file.id} className="group relative bg-card border border-border rounded-md overflow-hidden">
              <div className="aspect-square bg-secondary flex items-center justify-center p-2">
                <img src={file.url} alt={file.filename} className="max-w-full max-h-full object-contain" />
              </div>
              <div className="p-2 border-t border-border bg-card">
                <p className="text-xs font-medium truncate" title={file.filename}>{file.filename}</p>
                <div className="flex justify-between items-center mt-1 text-[10px] text-muted-foreground">
                  <span>{formatSize(file.size)}</span>
                  <span>{formatDate(file.createdAt)}</span>
                </div>
              </div>
              <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full" onClick={() => handleCopyUrl(file.url)} title="نسخ الرابط">
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" className="h-8 w-8 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => setDeleteTarget({ id: file.id, storagePath: file.storagePath })} title="حذف">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="حذف الملف"
        description="هل أنت متأكد من حذف هذا الملف نهائياً؟ سيتم حذفه من مساحة التخزين وقاعدة البيانات ولا يمكن التراجع عن هذا الإجراء."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
