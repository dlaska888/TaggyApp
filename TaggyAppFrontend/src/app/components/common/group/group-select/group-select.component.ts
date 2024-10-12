import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { GetGroupDto } from '../../../../models/dtos/group/getGroupDto';
import { PagedResults } from '../../../../models/dtos/pagedResults';
import { SieveModelDto } from '../../../../models/dtos/sieveModelDto';
import { TaggyAppApiService } from '../../../../services/taggyAppApi.service';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateGroupDto } from '../../../../models/dtos/group/createGroupDto';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { GroupStateService } from '../../../../services/groupStateService';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'group-select',
  standalone: true,
  imports: [
    CommonModule,
    DropdownModule,
    FloatLabelModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    SkeletonModule,
  ],
  templateUrl: './group-select.component.html',
  styleUrl: './group-select.component.scss',
})
export class GroupSelectComponent implements OnInit, OnChanges {
  newGroup!: CreateGroupDto;
  newGroupForm!: FormGroup;
  formVisible: boolean = false;

  selectedGroup?: GetGroupDto;
  pagedGroups!: PagedResults<GetGroupDto>;
  page: number = 1;
  rows: number = 20;
  loading: boolean = false;
  searchTimeout: any;

  skeletonArray = Array(this.rows);

  @Input()
  groupNameQuery?: string;

  @ViewChild('infiniteScrollParentElem')
  infiniteScrollParentElem!: ElementRef;
  @ViewChild('infiniteScrollChildElem')
  infiniteScrollChildElem!: ElementRef;

  constructor(
    private taggyAppApiService: TaggyAppApiService,
    private fb: RxFormBuilder,
    private groupState: GroupStateService
  ) {}

  ngOnInit(): void {
    this.initNewGroupForm();
    this.initPagination();
    this.onScrolled();
    this.groupState.getGroup$().subscribe((group) => {
      if (!group) return;
      this.selectedGroup = group;
      this.pagedGroups.items = this.pagedGroups.items.map((g) => {
        if (g.id === group.id) g = group;
        return g;
      });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['groupNameQuery'].previousValue === undefined) return;
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      if (!this.loading) {
        this.initPagination();
        this.onScrolled();
      }
    }, 500);
  }

  onSubmit(): void {
    this.taggyAppApiService.createGroup(this.newGroup).subscribe((response) => {
      if (response.ok) {
        this.formVisible = false;
        this.groupState.setGroup(response.body!);
        this.initNewGroupForm();
        this.initPagination();
        this.onScrolled();
      }
    });
  }

  onChange(event: GetGroupDto): void {
    this.groupState.setGroup(event);
  }

  onScrolled(): void {
    if (
      this.loading ||
      this.pagedGroups.pageNum === this.pagedGroups.totalPages
    )
      return;
    this.getGroups();
    this.page += 1;
  }

  private initNewGroupForm() {
    this.newGroup = new CreateGroupDto();
    this.newGroupForm = this.fb.formGroup(this.newGroup);
  }

  private initPagination(): void {
    this.page = 1;
    this.pagedGroups = {
      pageNum: this.page,
      pageSize: this.rows,
      totalItems: 0,
      totalPages: 0,
      items: [],
    };
  }

  private getGroups(): void {
    const query = new SieveModelDto(this.page, this.rows);
    if (this.groupNameQuery) query.filters = `name@=${this.groupNameQuery}`;

    this.loading = true;
    this.taggyAppApiService.getGroups(query).subscribe((response) => {
      const oldItems = this.pagedGroups.items;
      this.pagedGroups = response.body!;
      this.pagedGroups.items = [...oldItems, ...response.body!.items];
      if (this.pagedGroups.pageNum < this.pagedGroups.totalPages) {
        this.callbackUntilScrollable();
      }
      this.loading = false;
    });
  }

  private callbackUntilScrollable() {
    setTimeout(() => {
      if (
        this.infiniteScrollParentElem.nativeElement.clientHeight >
        this.infiniteScrollChildElem.nativeElement.scrollHeight
      ) {
        this.onScrolled();
      }
    }, 500);
  }
}
