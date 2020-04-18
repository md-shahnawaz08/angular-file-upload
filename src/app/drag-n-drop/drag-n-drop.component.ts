import { Component } from '@angular/core';
import { Upload } from 'tus-js-client';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-drag-n-drop',
  templateUrl: './drag-n-drop.component.html',
  styleUrls: ['./drag-n-drop.component.css']
})
export class DragNDropComponent {

  private endpoint = "https://master.tus.io/files/";
  private retryDelays = [0, 3000, 5000, 10000, 20000];
  files: any[] = [];
  uploadedFiles = {};
  uploadTasks = {};
 
  onSelect(event) {
    this.files.push(...event.addedFiles.map(file => {
      file.id = uuidv4();
      return file;
    }));
  }
  
  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  onUpload() {
    this.files.forEach(file => {
      const upload: any = new Upload(file, {
        endpoint: this.endpoint,
        retryDelays: this.retryDelays,
        metadata: {
            filename: file.name,
            filetype: file.type
        },
        onError: (e) => {
          alert(e)
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          this.files = this.files.filter(f => file.id != f.id);
          var percentage = (bytesUploaded / bytesTotal * 100).toFixed(2);
          file.bytesUploaded = bytesUploaded;
          file.bytesTotal = bytesTotal;
          file.percentage = percentage;
          this.uploadedFiles[file.id] = file;     
        },
        onSuccess: () => {
          file.uploadedName = upload.file.name;
          file.uploadedUrl = upload.url;
          this.uploadedFiles[file.id] = file;
        }
      });
      this.uploadTasks[file.id] = { upload };
      upload.start();
    });
  }

  onPause(id: string) {
    this.uploadTasks[id].upload.abort();
    this.uploadTasks[id].paused = true;
  }

  onResume(id: string) {
    this.uploadTasks[id].upload.start();
    this.uploadTasks[id].paused = false;
  }

  getUploadedFiles(): any[] {
    return Object.values(this.uploadedFiles);
  }
}
