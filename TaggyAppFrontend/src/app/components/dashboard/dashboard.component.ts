import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { GetFileDto } from '../../models/dtos/file/getFileDto';
import { TaggyAppApiService } from '../../services/taggyAppApi.service';
import { CommonModule } from '@angular/common';
import { PagedResults } from '../../models/dtos/pagedResults';
import { GetGroupDto } from '../../models/dtos/group/getGroupDto';
import { FileUploadComponent } from '../common/file-upload/file-upload.component';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    SidebarModule,
    ButtonModule,
    CardModule,
    DialogModule,
    FileUploadComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  pagedFiles!: PagedResults<GetFileDto>;
  pagedGroups!: PagedResults<GetGroupDto>;

  sidebarVisible: boolean = false;
  dialogVisible: boolean = false;

  clickedFile!: GetFileDto;

  supportedFileTypes: string[] = ['image', 'video', 'audio'];

  constructor(
    private taggyAppApiService: TaggyAppApiService,
    private sanitizer: DomSanitizer,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.taggyAppApiService.getUserGroups().subscribe((response) => {
      this.pagedGroups = response.body!;
    });
    this.getFiles();
  }

  onFilesUploaded(): void {
    this.getFiles();
  }

  onFileClick(file: GetFileDto): void {
    this.clickedFile = file;
    this.dialogVisible = true;
  }

  onEmbedError(): void {
    console.error('Error loading file');
  }

  private getFiles(): void {
    this.taggyAppApiService.getUserFiles().subscribe((response) => {
      this.pagedFiles = response.body!;
    });
  }
}
