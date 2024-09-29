import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import {
  DropdownModule,
  DropdownChangeEvent,
  DropdownLazyLoadEvent,
} from 'primeng/dropdown';
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
import { ScrollerOptions } from 'primeng/api';
import { GroupStateService } from '../../../../services/groupStateService';

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
  ],
  templateUrl: './group-select.component.html',
  styleUrl: './group-select.component.scss',
})
export class GroupSelectComponent implements OnInit {
  loading: boolean = true;
  newGroup!: CreateGroupDto;
  newGroupForm!: FormGroup;
  formVisible: boolean = false;

  page: number = 1;
  rows: number = 10;

  options: ScrollerOptions = {
    delay: 300,
    showLoader: true,
    lazy: true,
  };

  pagedGroups!: PagedResults<GetGroupDto>;
  selectedGroup!: GetGroupDto;
  groupId!: string; // dropdown state wont work with selectedGroup.id

  constructor(
    private taggyAppApiService: TaggyAppApiService,
    private fb: RxFormBuilder,
    private groupState: GroupStateService
  ) {}

  ngOnInit(): void {
    this.initNewGroupForm();
    this.initPagination();
    this.getGroups();
    this.groupState.getGroup$().subscribe((group) => {
      if (!group) return;
      this.selectedGroup = group;
      this.groupId = group.id;
      this.pagedGroups.items = this.pagedGroups.items.map((g) => {
        if (g.id === group.id) g = group;
        return g;
      });
    });
  }

  onChange(event: DropdownChangeEvent): void {
    const group = this.pagedGroups.items.find((g) => g.id === event.value);
    this.groupState.setGroup(group!);
  }

  onLazyLoad(event: DropdownLazyLoadEvent): void {
    if (this.pagedGroups.pageNum === this.pagedGroups.totalPages) {
      return;
    }
    this.page = event.last / this.rows + 1;
    this.getGroups();
  }

  onSubmit(): void {
    this.taggyAppApiService.createGroup(this.newGroup).subscribe((response) => {
      if (response.ok) {
        this.formVisible = false;
        this.groupState.setGroup(response.body!);
        this.initNewGroupForm();
        this.initPagination();
        this.getGroups();
      }
    });
  }

  private getGroups(): void {
    const query = new SieveModelDto(this.page, this.rows);
    this.loading = true;
    this.taggyAppApiService.getGroups(query).subscribe((response) => {
      const oldItems = this.pagedGroups.items;
      this.pagedGroups = response.body!;
      this.pagedGroups.items = [...oldItems, ...response.body!.items];
      this.loading = false;
    });
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
}
