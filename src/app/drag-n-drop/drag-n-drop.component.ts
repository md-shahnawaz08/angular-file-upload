import { Component } from '@angular/core';
import * as S3 from 'aws-sdk/clients/s3';
import { v4 as uuidv4 } from 'uuid';
import { Validators } from '@angular/forms';

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
      accessKeyId: 'my key',
      secretAccessKey: 'my secret key'
    }
  });

  private bucketName = 'dguptaawsbucket';
  folder = ''
  files: any[] = [];
  uploadedFiles = {};
  toShow = true;
  isValid = false;
  email: any;

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
    for (const file of this.files) {
      const params = {
        Bucket: this.bucketName,
        Key: this.folder + '/' + file.name,
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
    }
  }

  async onLoading(): Promise<boolean> {
    this.bucket.headObject({
        Bucket: this.bucketName,
        Key: this.folder + '/',
      })
      .promise()
      .then(
        () =>
        {
          this.isValid = true;
          this.toShow = true;
          return this.isValid;
        },
        err => {
          if (err.code === 'NotFound') {
            this.toShow = false;
            this.isValid = false;
            return this.isValid;
          }
          throw err;
        }
      );

    return this.isValid;
  }

  onPush(){

  }

  getUploadedFiles(): any[] {
    return Object.values(this.uploadedFiles);
  }
}
