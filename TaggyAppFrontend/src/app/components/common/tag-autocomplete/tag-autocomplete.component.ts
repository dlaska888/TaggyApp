import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
  AutoCompleteSelectEvent,
  AutoCompleteUnselectEvent,
} from 'primeng/autocomplete';
import { CreateTagDto } from '../../../models/dtos/tag/createTagDto';
import { GetGroupDto } from '../../../models/dtos/group/getGroupDto';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';

@Component({
  selector: 'tag-autocomplete',
  standalone: true,
  imports: [CommonModule, AutoCompleteModule, FloatLabelModule, FormsModule],
  templateUrl: './tag-autocomplete.component.html',
  styleUrl: './tag-autocomplete.component.scss',
})
export class TagAutocompleteComponent {
  @Input()
  group!: GetGroupDto;

  @Input()
  tags: CreateTagDto[] = [];

  @Output()
  tagsChange = new EventEmitter<CreateTagDto[]>();

  @Output()
  onTagsValidation = new EventEmitter<boolean>();
  tagsValid: boolean = true;

  tagSuggestions: CreateTagDto[] = [];

  constructor(private fb: RxFormBuilder) {}

  onTagSuggestionComplete(event: AutoCompleteCompleteEvent) {
    this.tagSuggestions = this.group.tags.filter((t) =>
      t.name.toLowerCase().startsWith(event.query.toLowerCase())
    );
  }

  onTagKeyUp(event: KeyboardEvent) {
    if (event.key == ' ' || event.code == 'Space') {
      let tokenInput = event.srcElement as any;
      if (tokenInput.value) {
        this.addTag(tokenInput.value.replace(' ', ''));
        tokenInput.value = '';
      }
    }
  }

  onSelect() {
    this.tagsChange.emit(this.tags);
  }

  onUnselect(event: AutoCompleteUnselectEvent) {
    this.tags = this.tags.filter((t) => t != event.value);
    this.validateTags();
    this.tagsChange.emit(this.tags);
  }

  private addTag(name: string) {
    this.tags.push({ name: name });
    this.validateTags();
    this.tagsChange.emit(this.tags);
  }

  private validateTags() {
    this.tagsValid = this.tags.every((t) => {
      const tag = new CreateTagDto();
      tag.name = t.name;
      const tagForm = this.fb.formGroup(tag);
      return tagForm.valid;
    });
    this.onTagsValidation.emit(this.tagsValid);
  }
}
