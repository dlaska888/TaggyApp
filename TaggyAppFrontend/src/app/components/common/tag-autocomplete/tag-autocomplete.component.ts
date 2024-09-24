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

@Component({
  selector: 'tag-autocomplete',
  standalone: true,
  imports: [AutoCompleteModule, FloatLabelModule, FormsModule],
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

  tagSuggestions: CreateTagDto[] = [];

  onTagSuggestionComplete(event: AutoCompleteCompleteEvent) {
    this.tagSuggestions = this.group.tags.filter((t) =>
      t.name.toLowerCase().startsWith(event.query.toLowerCase())
    );
  }

  onTagKeyUp(event: KeyboardEvent) {
    if (event.key == ' ' || event.code == 'Space') {
      let tokenInput = event.srcElement as any;
      if (tokenInput.value) {
        this.addTag(tokenInput.value.trim());
        tokenInput.value = '';
      }
    }
  }

  onSelect() {
    this.tagsChange.emit(this.tags);
  }

  onUnselect(event: AutoCompleteUnselectEvent) {
    this.tags = this.tags.filter((t) => t != event.value);
    this.tagsChange.emit(this.tags);
  }

  private addTag(tag: string) {
    if (!this.tags) this.tags = [];
    this.tags.push({ name: tag });
    this.tagsChange.emit(this.tags);
  }
}
