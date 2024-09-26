import { CommonModule } from '@angular/common';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  DropdownModule,
  DropdownChangeEvent,
  DropdownLazyLoadEvent,
} from 'primeng/dropdown';
import { GetGroupDto } from '../../../../models/dtos/group/getGroupDto';
import { PagedResults } from '../../../../models/dtos/pagedResults';
import { SieveModelDto } from '../../../../models/dtos/sieveModelDto';
import { TaggyAppApiService } from '../../../../services/taggyAppApi.service';

@Component({
  selector: 'group-select',
  standalone: true,
  imports: [CommonModule, DropdownModule],
  templateUrl: './group-select.component.html',
  styleUrl: './group-select.component.scss',
})
export class GroupSelectComponent implements OnInit {
  pagedGroups!: PagedResults<GetGroupDto>;

  page: number = 1;
  rows: number = 10;

  @Output()
  groupChange: EventEmitter<GetGroupDto> = new EventEmitter<GetGroupDto>();

  constructor(private taggyAppApiService: TaggyAppApiService) {}

  ngOnInit(): void {
    this.getGroups();
  }

  onChange(event: DropdownChangeEvent): void {
    this.groupChange.emit(event.value);
  }

  onLazyLoad(event: DropdownLazyLoadEvent): void {
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
      this.groupChange.emit(this.pagedGroups.items[0]);
    });
  }
}
