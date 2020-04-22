import {Component} from '@angular/core';
import * as S3 from 'aws-sdk/clients/s3';
import {v4 as uuidv4} from 'uuid';
import {ContactComponent as cc} from '../email/contact.component';

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
      accessKeyId: 'AKIAIKGZLTRXVRRU5Y4Q',
      secretAccessKey: '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'
    }
  });

  private bucketName = 'dguptaawsbucket';
  folder = '';
  root = 'root';
  files: any[] = [];
  uploadedFiles = {};
  toShow = true;
  isValid = false;
  email: any;
  tbDisabled = false;
  contactComponent = new cc();

  onSelect(event) {
    this.files.push(...event.addedFiles.map(file => {
      file.id = uuidv4();
      return file;
    }));
  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  async onUpload() {
    for (const file of this.files) {
      file.id = uuidv4();

      const params = {
        Bucket: this.bucketName,
        Key: this.root + '/' + this.folder + '/' + file.name + '.' + file.id,
        Body: file,
        ACL: 'public-read',
        ContentType: file.type
      };

      this.bucket.upload(params).on('httpUploadProgress', evt => {
        // tslint:disable-next-line:triple-equals
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

  async onLoading() {
    this.bucket.headObject({
      Bucket: this.bucketName,
      Key: this.root + '/' + this.folder + '/',
    })
      .promise()
      .then(
        () => {
          this.isValid = true;
          this.toShow = true;
          this.tbDisabled = true;
        },
        err => {
          if (err.code === 'NotFound') {
            this.toShow = false;
            this.isValid = false;
          }
        }
      );
  }

  onReset(){
    this.folder = '';
    this.email = '';
    this.tbDisabled = false;
    this.isValid = false;
  }

  sendEmail() {
    this.contactComponent.sendMessage(this.email, this.folder);
  }

  getUploadedFiles(): any[] {
    return Object.values(this.uploadedFiles);
  }
}
