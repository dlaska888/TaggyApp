import { CommonModule, NgOptimizedImage } from "@angular/common";
import { Component, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { SelectItem } from "primeng/api";
import { BadgeModule } from "primeng/badge";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DataViewModule } from "primeng/dataview";
import { DropdownModule, DropdownChangeEvent } from "primeng/dropdown";
import { FloatLabelModule } from "primeng/floatlabel";
import { InputTextModule } from "primeng/inputtext";
import { MultiSelectModule } from "primeng/multiselect";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { PaginatorModule, PaginatorState } from "primeng/paginator";
import { SidebarModule } from "primeng/sidebar";
import { SkeletonModule } from "primeng/skeleton";
import { GetFileDto } from "../../../../models/dtos/file/getFileDto";
import { GetGroupDto } from "../../../../models/dtos/group/getGroupDto";
import { PagedResults } from "../../../../models/dtos/pagedResults";
import { SieveModelDto } from "../../../../models/dtos/sieveModelDto";
import { FileSizePipe } from "../../../../pipes/file-size.pipe";
import { GroupStateService } from "../../../../services/groupStateService";
import { TaggyAppApiService } from "../../../../services/taggyAppApi.service";
import { FileUploadComponent } from "../../file/file-upload/file-upload.component";
import { FileViewDialogComponent } from "../../file/file-view-dialog/file-view-dialog.component";
import { TagAutocompleteComponent } from "../../tag-autocomplete/tag-autocomplete.component";
import { GroupInfoComponent } from "../group-info/group-info.component";
import { GroupSelectComponent } from "../group-select/group-select.component";

@UntilDestroy()
@Component({
  selector: 'group-view',
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
  templateUrl: './group-view.component.html',
  styleUrl: './group-view.component.scss',
})
export class GroupViewComponent implements OnInit {

  @Output()
  menuOpenChange = new EventEmitter<boolean>(false);

  layout: 'list' | 'grid' = 'list';
  searchPlaceholder: string = 'Search...';

  nameQuery: string = '';

  pagedFiles!: PagedResults<GetFileDto>;
  pagedGroups!: PagedResults<GetGroupDto>;

  selectedFile!: GetFileDto;
  selectedGroup!: GetGroupDto;

  groupInfoVisible: boolean = false;
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
    private taggyApi: TaggyAppApiService,
    private groupState: GroupStateService,
  ) {}

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
    this.groupState
      .getGroup$()
      .pipe(untilDestroyed(this))
      .subscribe((group) => {
        if (group) {
          this.selectedGroup = group;
          this.refreshGroup();
        }
      });
  }

  onMenuOpen(): void {
    this.menuOpenChange.emit(true);
  }

  onFilesUploaded(): void {
    this.refreshGroup();
  }

  onFileSelected(file: GetFileDto): void {
    this.selectedFile = file;
    this.fileViewVisible = true;
  }

  onFileChanged(): void {
    this.refreshGroup();
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
