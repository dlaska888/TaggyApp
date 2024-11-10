import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CreateGroupDto } from '../../../../models/dtos/group/createGroupDto';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TaggyAppApiService } from '../../../../services/taggyAppApi.service';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { GroupStateService } from '../../../../services/groupStateService';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { finalize } from 'rxjs';

@Component({
  selector: 'add-group',
  standalone: true,
  imports: [CommonModule, ButtonModule, InputTextModule, ReactiveFormsModule],
  templateUrl: './add-group.component.html',
  styleUrl: './add-group.component.scss',
})
export class AddGroupComponent implements OnInit {
  newGroup!: CreateGroupDto;
  newGroupForm!: FormGroup;
  formVisible: boolean = false;
  apiLoading: boolean = false;

  @Output()
  formSubmit = new EventEmitter<null>();

  constructor(
    private taggyAppApiService: TaggyAppApiService,
    private fb: RxFormBuilder,
    private groupState: GroupStateService
  ) {}

  ngOnInit(): void {
    this.initNewGroupForm();
  }

  onSubmit(): void {
    this.apiLoading = true;
    this.taggyAppApiService
      .createGroup(this.newGroup)
      .pipe(finalize(() => (this.apiLoading = false)))
      .subscribe((response) => {
        if (response.ok) {
          this.formVisible = false;
          this.groupState.setGroup(response.body!);
          this.initNewGroupForm();
          this.formSubmit.emit();
        }
      });
  }

  private initNewGroupForm() {
    this.newGroup = new CreateGroupDto();
    this.newGroupForm = this.fb.formGroup(this.newGroup);
  }
}
