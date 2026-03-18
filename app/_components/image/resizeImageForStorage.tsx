export async function resizeImageForStorage(
  file: File,
  maxWidth: number = 2000,
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      reject(new Error("Failed to get canvas context"));
      return;
    }

    img.onload = () => {
      // Calculate new dimensions
      let newWidth = img.width;
      let newHeight = img.height;

      if (img.width > maxWidth) {
        newWidth = maxWidth;
        newHeight = Math.round((img.height / img.width) * maxWidth);
      }

      canvas.width = newWidth;
      canvas.height = newHeight;

      // Draw and compress as WebP
      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Canvas blob conversion failed"));
            return;
          }

          const resizedFile = new File(
            [blob],
            file.name.replace(/\.[^.]+$/, ".webp"),
            { type: "image/webp" },
          );

          const originalSizeKB = (file.size / 1024).toFixed(2);
          const newSizeKB = (blob.size / 1024).toFixed(2);

          resolve(resizedFile);
        },
        "image/webp",
        0.85,
      );
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };
    reader.readAsDataURL(file);
  });
}
