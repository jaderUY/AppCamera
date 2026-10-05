import { Injectable } from '@angular/core';
import { Camera } from '@capacitor/camera';

export interface Photo {
  name: string;
  source: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  constructor() { }

  public async takePhoto(): Promise<Photo> {
    // Reemplazamos getPhoto por el nuevo método takePhoto
    const capturedPhoto = await Camera.takePhoto({
      quality: 90,
      saveToGallery: true,
    });

    const currentDate = new Date();

    return {
      name: `photo_${currentDate.getTime()}.jpeg`,
      source: capturedPhoto.webPath || '',
      createdAt: currentDate.toISOString()
    };
  }
}