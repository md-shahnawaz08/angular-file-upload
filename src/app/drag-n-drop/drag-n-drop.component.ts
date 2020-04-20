import { Component } from '@angular/core';
import * as S3 from 'aws-sdk/clients/s3';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-drag-n-drop',
  templateUrl: './drag-n-drop.component.html',
  styleUrls: ['./drag-n-drop.component.css']
})
export class DragNDropComponent {

  private bucket = new S3({
    apiVersion: '2006-03-01',
    region: 'us-west-2',
    credentials: {
      accessKeyId: 'AKIAJ7OTALLGYW64YWTQ',
      secretAccessKey: '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'
    }
  });
  private bucketName = 'dguptaawsbucket';
  folder = ''
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
      const params = {
        Bucket: this.bucketName,
        Key: this.folder + file.name,
        Body: file,
        ACL: 'public-read',
        ContentType: file.type
      };

      this.bucket.upload(params).on('httpUploadProgress', evt => {
        this.files = this.files.filter(f => file.id != f.id);
        file.loaded = evt.loaded;
        file.total = evt.total;
        file.percentage = evt.loaded / evt.total * 100;
        this.uploadedFiles[file.id] = file;
      }).send((err, data) => {
        if (err) {
            alert(err);
            return;
        }
        file.location = data.Location;
        this.uploadedFiles[file.id] = file;
      });
    });
  }

  getUploadedFiles(): any[] {
    return Object.values(this.uploadedFiles);
  }
}
