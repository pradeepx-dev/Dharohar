import axios from 'axios';

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
const IMGBB_API_URL = 'https://api.imgbb.com/1/upload';

interface ImgBBResponse {
    data: {
        url: string;
        display_url: string;
        delete_url: string;
    };
    success: boolean;
    status: number;
}

export const uploadImage = async (file: File): Promise<string> => {
    if (!IMGBB_API_KEY) {
        throw new Error('ImgBB API key is missing. Please set VITE_IMGBB_API_KEY in your environment variables.');
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await axios.post<ImgBBResponse>(IMGBB_API_URL, formData, {
            params: {
                key: IMGBB_API_KEY,
            },
        });

        if (response.data && response.data.success) {
            return response.data.data.url;
        } else {
            throw new Error('ImgBB upload failed: ' + (response.data ? JSON.stringify(response.data) : 'Unknown error'));
        }
    } catch (error: any) {
        console.error('Error uploading to ImgBB:', error);
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(`ImgBB API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
        }
        throw error;
    }
};
