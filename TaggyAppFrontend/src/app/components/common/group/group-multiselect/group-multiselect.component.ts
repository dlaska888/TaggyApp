import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TaggyAppApiService } from '../../../../services/taggyAppApi.service';
import { PagedResults } from '../../../../models/dtos/pagedResults';
import { SieveModelDto } from '../../../../models/dtos/sieveModelDto';
import { GetGroupDto } from '../../../../models/dtos/group/getGroupDto';
import { CommonModule } from '@angular/common';
import {
  MultiSelectChangeEvent,
  MultiSelectLazyLoadEvent,
  MultiSelectModule,
} from 'primeng/multiselect';

@Component({
  selector: 'group-multiselect',
  standalone: true,
  imports: [CommonModule, MultiSelectModule],
  templateUrl: './group-multiselect.component.html',
  styleUrl: './group-multiselect.component.scss',
})
export class GroupMultiSelect implements OnInit {
  pagedGroups!: PagedResults<GetGroupDto>;

  page: number = 1;
  rows: number = 100;

  @Output()
  groupChange = new EventEmitter<GetGroupDto[]>();

  constructor(private taggyAppApiService: TaggyAppApiService) {}

  ngOnInit(): void {
    this.getGroups();
  }

  onChange(event: MultiSelectChangeEvent): void {
    this.groupChange.emit(event.value);
  }

  onLazyLoad(event: MultiSelectLazyLoadEvent): void {
    this.page = event.first! / this.rows + 1;
    this.getGroups(new SieveModelDto(this.page, this.rows));
  }

  refreshGroups(): void {
    this.getGroups();
  }

  private getGroups(
    query: SieveModelDto = new SieveModelDto(1, this.rows)
  ): void {
    this.taggyAppApiService.getUserGroups(query).subscribe((response) => {
      this.pagedGroups = response.body!;
      this.groupChange.emit(this.pagedGroups.items);
    });
  }
}
