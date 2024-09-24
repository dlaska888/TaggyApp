import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { FileViewModel } from '../../../models/ui/fileViewModel';

@Component({
  selector: 'file-view-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  templateUrl: './file-view-dialog.component.html',
  styleUrl: './file-view-dialog.component.scss'
})
export class FileViewDialogComponent {
  supportedFileTypes: string[] = ['image', 'video', 'audio'];

  @Input()
  visible: boolean = false;

  @Output()
  visibleChange = new EventEmitter<boolean>();

  @Input()
  file!: FileViewModel;
}
