import { Component, OnInit, ViewChild } from '@angular/core';
import { GetFileDto } from '../../models/dtos/file/getFileDto';
import { TaggyAppApiService } from '../../services/taggyAppApi.service';
import { CommonModule } from '@angular/common';
import { PagedResults } from '../../models/dtos/pagedResults';
import { GetGroupDto } from '../../models/dtos/group/getGroupDto';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DomSanitizer } from '@angular/platform-browser';
import { DataViewLayoutOptions, DataViewModule } from 'primeng/dataview';
import { BadgeModule } from 'primeng/badge';
import { SieveModelDto } from '../../models/dtos/sieveModelDto';
import { FileSizePipe } from '../../pipes/file-size.pipe';
import { MessageService, SelectItem } from 'primeng/api';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { MultiSelectModule } from 'primeng/multiselect';
import { TagAutocompleteComponent } from '../common/tag-autocomplete/tag-autocomplete.component';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FileViewDialogComponent } from '../common/file/file-view-dialog/file-view-dialog.component';
import { GroupMultiSelect } from '../common/group/group-multiselect/group-multiselect.component';
import { FileUploadComponent } from '../common/file/file-upload/file-upload.component';
import { GroupSelectComponent } from '../common/group/group-select/group-select.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    SidebarModule,
    ButtonModule,
    CardModule,
    DataViewModule,
    BadgeModule,
    DropdownModule,
    PaginatorModule,
    MultiSelectModule,
    FloatLabelModule,
    FileUploadComponent,
    FileSizePipe,
    GroupSelectComponent,
    TagAutocompleteComponent,
    FileViewDialogComponent,
    GroupMultiSelect,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  layout: 'list' | 'grid' = 'list';

  pagedFiles!: PagedResults<GetFileDto>;
  pagedGroups!: PagedResults<GetGroupDto>;

  selectedFile!: GetFileDto;
  selectedGroups!: GetGroupDto[];

  sidebarVisible: boolean = false;
  dialogVisible: boolean = false;

  selectedSort!: string;
  sortOptions!: SelectItem[];
  selectedSortOperator!: string;
  sortOperatorOptions!: SelectItem[];
  get sort(): string {
    return `${this.selectedSortOperator}${this.selectedSort}`;
  }

  selectedTags: string[] = [];
  selectedTagOperator!: string;
  tagOperatorOptions!: SelectItem[];
  get tagFilter(): string {
    if (this.selectedTags?.length > 0)
      return `WithTags${this.selectedTagOperator}${this.selectedTags.join(
        '|'
      )}`;
    return '';
  }

  filePage: number = 1;
  fileRows: number = 10;

  @ViewChild(GroupSelectComponent)
  groupSelectComponent!: GroupSelectComponent;

  constructor(
    public sanitizer: DomSanitizer,
    private taggyAppApiService: TaggyAppApiService
  ) {}

  ngOnInit(): void {
    this.selectedSort = 'createdAt';
    this.sortOptions = [
      { label: 'Name', value: 'name' },
      { label: 'Size', value: 'size' },
      { label: 'Created', value: 'createdAt' },
    ];
    this.selectedSortOperator = '-';
    this.sortOperatorOptions = [
      { label: 'Descending', value: '-' },
      { label: 'Ascending', value: '' },
    ];
    this.selectedTagOperator = '@=';
    this.tagOperatorOptions = [
      { label: 'Any', value: '@=' },
      { label: 'All', value: '==' },
    ];
    this.getFiles();
  }

  onFilesUploaded(): void {
    this.getFiles();
    if (this.groupSelectComponent) this.groupSelectComponent.refreshGroups();
  }

  onFileSelected(file: GetFileDto): void {
    console
    this.selectedFile = file;
    this.dialogVisible = true;
  }

  onFileDeleted(): void {
    this.getFiles();
  }

  onPageChange(event: PaginatorState) {
    this.filePage = event.page! + 1;
    this.fileRows = event.rows!;
    this.getFiles();
  }

  onSortChange(event: DropdownChangeEvent) {
    this.selectedSort = event.value ?? 'createdAt';
    this.getFiles();
  }

  onSortOperatorChange(event: DropdownChangeEvent) {
    this.selectedSortOperator = event.value ?? '-';
    this.getFiles();
  }

  onGroupsChange(groups: GetGroupDto[]) {
    this.selectedGroups = groups;
    this.getFiles();
  }

  onTagsChange() {
    this.getFiles();
  }

  onTagOperatorChange(event: DropdownChangeEvent) {
    this.selectedTagOperator = event.value;
    this.getFiles();
  }

  private getFiles(): void {
    const query = new SieveModelDto(
      this.filePage,
      this.fileRows,
      this.sort,
      this.tagFilter
    );
    this.taggyAppApiService.getUserFiles(query).subscribe((response) => {
      this.pagedFiles = response.body!;
    });
  }
}
