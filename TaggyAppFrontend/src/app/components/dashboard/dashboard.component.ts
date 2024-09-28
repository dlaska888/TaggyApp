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
import { FileUploadComponent } from '../common/file/file-upload/file-upload.component';
import { GroupSelectComponent } from '../common/group/group-select/group-select.component';
import { SkeletonModule } from 'primeng/skeleton';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { NgOptimizedImage } from '@angular/common';
import { InputText, InputTextModule } from 'primeng/inputtext';
import { GroupInfoComponent } from '../common/group/group-info/group-info.component';
import { UserStateService } from '../../services/userStateService';
import { GroupStateService } from '../../services/groupStateService';

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
    OverlayPanelModule,
    InputTextModule,
    SkeletonModule,
    NgOptimizedImage,
    FileUploadComponent,
    FileSizePipe,
    GroupSelectComponent,
    TagAutocompleteComponent,
    FileViewDialogComponent,
    GroupInfoComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  layout: 'list' | 'grid' = 'list';
  searchPlaceholder: string = 'Search...';

  nameQuery: string = '';

  pagedFiles!: PagedResults<GetFileDto>;
  pagedGroups!: PagedResults<GetGroupDto>;

  selectedFile!: GetFileDto;
  selectedGroup!: GetGroupDto;

  menuBarVisible: boolean = false;
  groupViewVisible: boolean = false;
  filtersVisible: boolean = false;
  fileUploadVisible: boolean = false;
  fileViewVisible: boolean = false;

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
  fileRowsOptions: number[] = [10, 20, 50];

  loading: boolean = true;
  skeletonArray: any[] = Array(this.fileRows);

  @ViewChild(GroupSelectComponent)
  groupSelectComponent!: GroupSelectComponent;

  constructor(
    public sanitizer: DomSanitizer,
    private taggyApi: TaggyAppApiService,
    private userState: UserStateService,
    private groupState: GroupStateService
  ) {
    this.userState.initUserState();
    this.userState.getUser().subscribe((user) => {
      if (user) {
        this.groupState.initGroupState();
      }
    });
    this.groupState.getGroup().subscribe((group) => {
      if (group) {
        this.selectedGroup = group;
        this.refreshGroup();
        this.menuBarVisible = false;
      }
    });
  }

  ngOnInit(): void {
    this.pagedFiles = {
      pageNum: this.filePage,
      pageSize: this.fileRows,
      totalItems: 0,
      totalPages: 0,
      items: [],
    };
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
  }

  onFilesUploaded(): void {
    this.refreshGroup();
  }

  onFileSelected(file: GetFileDto): void {
    this.selectedFile = file;
    this.fileViewVisible = true;
  }

  onFileDeleted(): void {
    this.refreshGroup();
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
    this.loading = true;
    this.taggyApi
      .getGroupFiles(this.selectedGroup.id, query)
      .subscribe((response) => {
        this.pagedFiles = response.body!;
        this.loading = false;
      });
  }

  private refreshGroup(): void {
    this.taggyApi.getGroupById(this.selectedGroup.id).subscribe(
      (response) => {
        this.selectedGroup = response.body!;
        this.searchPlaceholder = `Search in ${response.body!.name}...`;
        this.getFiles();
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
