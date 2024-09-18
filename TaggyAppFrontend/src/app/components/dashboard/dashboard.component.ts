import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { GetFileDto } from '../../models/dtos/file/getFileDto';
import { TaggyAppApiService } from '../../services/taggyAppApi.service';
import { CommonModule } from '@angular/common';
import { PagedResults } from '../../models/dtos/pagedResults';
import { GetGroupDto } from '../../models/dtos/group/getGroupDto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  pagedFiles!: PagedResults<GetFileDto>;
  pagedGroups!: PagedResults<GetGroupDto>;

  constructor(private taggyAppApiService: TaggyAppApiService) {}

  ngOnInit(): void {
    this.taggyAppApiService.getUserFiles().subscribe((response) => {
      this.pagedFiles = response.body!;
    });
    this.taggyAppApiService.getUserGroups().subscribe((response) => {
      this.pagedGroups = response.body!;
    });
  }
}
