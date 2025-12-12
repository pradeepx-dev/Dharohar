
/**
 * Converts a file to WebP format using HTMLCanvasElement.
 * @param file The input image file (JPEG, PNG, etc.)
 * @param quality Quality of the output WebP image (0 to 1, default 0.8)
 * @returns A Promise that resolves to the converted WebP File object.
 */
export const convertImageToWebP = (file: File, quality: number = 0.8): Promise<File> => {
    return new Promise((resolve, reject) => {
        // If it's already WebP, resolve immediately
        if (file.type === 'image/webp') {
            resolve(file);
            return;
        }

        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Canvas context could not be created'));
                return;
            }

            // Draw image to canvas
            ctx.drawImage(img, 0, 0);

            // Convert to WebP blob
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        // Create a new File from the blob, keeping the original name but changing extension
                        const newName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
                        const newFile = new File([blob], newName, { type: 'image/webp' });
                        resolve(newFile);
                    } else {
                        reject(new Error('Canvas to Blob conversion failed'));
                    }
                },
                'image/webp',
                quality
            );
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load image for conversion'));
        };

        img.src = url;
    });
};
