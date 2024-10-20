import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { MenuModule } from 'primeng/menu';
import { FileViewModel } from '../../../../models/ui/fileView.model';
import { ToastModule } from 'primeng/toast';
import { MenuItem } from 'primeng/api';
import { SidebarModule } from 'primeng/sidebar';
import { FileInfoComponent } from '../file-info/file-info.component';
import { GetFileDto } from '../../../../models/dtos/file/getFileDto';

@Component({
  selector: 'file-view-dialog',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    ToastModule,
    MenuModule,
    SidebarModule,
    FileInfoComponent,
  ],
  templateUrl: './file-view-dialog.component.html',
  styleUrl: './file-view-dialog.component.scss',
})
export class FileViewDialogComponent implements OnChanges {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() file!: GetFileDto;
  @Output() fileChange = new EventEmitter<void>();
  @Output() fileDelete = new EventEmitter<void>();

  supportedFileTypes: string[] = ['image', 'video', 'audio'];

  menuItems!: MenuItem[];

  sidebarVisible: boolean = false;

  ngOnChanges() {
    if (this.file) this.initMenuItems();
  }

  onFileChanged() {
    this.fileChange.emit();
  }

  onFileDeleted() {
    this.visible = false;
    this.sidebarVisible = false;
    this.fileDelete.emit();
  }

  private initMenuItems() {
    this.menuItems = [
      {
        label: 'View Info',
        icon: 'pi pi-info-circle',
        command: () => {
          this.sidebarVisible = true;
        },
      },
      {
        label: 'Download',
        icon: 'pi pi-download',
        url: this.file.url,
        target: '_self',
      },
    ];
  }
}
