import { loadHeic2any } from "./loadHeic2any";
import { resizeImageForStorage } from "./resizeImageForStorage";
export async function handleImageChange(
  e: React.ChangeEvent<HTMLInputElement>,
) {
  function setLoading(arg0: boolean) {
    throw new Error("Function not implemented.");
  }

  function setImageFile(arg0: File) {
    throw new Error("Function not implemented.");
  }

  function setPreview(arg0: string) {
    throw new Error("Function not implemented.");
  }

  let file = e.target.files?.[0];
  if (!file) return;

  setLoading(true);
  try {
    let processedFile = file;

    // 1. Handle HEIC if necessary
    if (
      file.type === "image/heic" ||
      file.name.toLowerCase().endsWith(".heic")
    ) {
      const heic2any = await loadHeic2any();
      const convertedBlob = await heic2any({
        blob: file,
        toType: "image/jpeg",
      });
      processedFile = new File(
        Array.isArray(convertedBlob) ? convertedBlob : [convertedBlob],
        file.name.replace(/\.[^.]+$/, ".jpg"),
        { type: "image/jpeg" },
      );
    }

    // 2. Resize and Convert to WebP (This replaces 'normalizeImage')
    const finalFile = await resizeImageForStorage(processedFile, 2000);

    // 3. Update State
    setImageFile(finalFile);
    setPreview(URL.createObjectURL(finalFile));
  } catch (error) {
    console.error("Image processing failed:", error);
    alert("حدث خطأ أثناء معالجة الصورة");
  } finally {
    setLoading(false);
  }
}
