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
import { DomSanitizer } from '@angular/platform-browser';
import { DataViewLazyLoadEvent, DataViewModule } from 'primeng/dataview';
import { BadgeModule } from 'primeng/badge';
import { SieveModelDto } from '../../models/dtos/sieveModelDto';
import { FileSizePipe } from '../../pipes/file-size.pipe';
import { SelectItem } from 'primeng/api';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    SidebarModule,
    ButtonModule,
    CardModule,
    DialogModule,
    DataViewModule,
    BadgeModule,
    DropdownModule,
    PaginatorModule,
    FileUploadComponent,
    FileSizePipe,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  pagedFiles!: PagedResults<GetFileDto>;
  pagedGroups!: PagedResults<GetGroupDto>;

  sidebarVisible: boolean = false;
  dialogVisible: boolean = false;

  selectedFile!: GetFileDto;

  supportedFileTypes: string[] = ['image', 'video', 'audio'];

  sortOptions!: SelectItem[];
  sortField!: string;

  currentPage: number = 1;
  rows: number = 10;

  constructor(
    private taggyAppApiService: TaggyAppApiService,
    public sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.taggyAppApiService.getUserGroups().subscribe((response) => {
      this.pagedGroups = response.body!;
    });
    this.getFiles();
    this.sortOptions = [
      { label: 'Name', value: 'name' },
      { label: 'Name-', value: '-name' }
  ];
  }

  onFilesUploaded(): void {
    this.getFiles();
  }

  onFileClick(file: GetFileDto): void {
    this.selectedFile = file;
    this.dialogVisible = true;
  }

  onPageChange(event: PaginatorState) {
    this.rows = event.rows!;
    this.getFiles(new SieveModelDto(event.page! + 1, event.rows));
  }

  onSortChange(event: DropdownChangeEvent) {
    this.sortField = event.value;
    this.getFiles(new SieveModelDto(this.currentPage, this.rows, this.sortField));
  }

  onEmbedError(): void {
    console.error('Error loading file');
  }

  private getFiles(query: SieveModelDto = new SieveModelDto(1, this.rows)): void {
    this.taggyAppApiService.getUserFiles(query).subscribe((response) => {
      this.pagedFiles = response.body!;
    });
  }
}
