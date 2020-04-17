import { Component } from '@angular/core';

@Component({
  selector: 'app-drag-n-drop',
  templateUrl: './drag-n-drop.component.html',
  styleUrls: ['./drag-n-drop.component.css']
})
export class DragNDropComponent {

  files: File[] = [];
 
  onSelect(event) {
    this.files.push(...event.addedFiles);

    event.addedFiles.forEach((file) => {
      const reader = new FileReader()
 
      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
      // Do whatever you want with the file contents
        const binaryStr = reader.result
        console.log(binaryStr)
      }
      reader.readAsArrayBuffer(file)
    })
  }
  
  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
  }
}
