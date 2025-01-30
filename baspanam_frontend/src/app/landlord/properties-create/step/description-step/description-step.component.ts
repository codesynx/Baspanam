import {Component, EventEmitter, input, OnInit, Output} from '@angular/core';
import {InputTextModule} from "primeng/inputtext";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Description} from "../../../model/listing.model";
import {InputTextareaModule} from "primeng/inputtextarea";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-description-step',
  standalone: true,
  imports: [
    InputTextModule, 
    FormsModule, 
    ReactiveFormsModule,
    InputTextareaModule,
    TranslateModule
  ],
  templateUrl: './description-step.component.html',
  styleUrl: './description-step.component.scss'
})
export class DescriptionStepComponent implements OnInit {
  description = input.required<Description>();

  titleControl = new FormControl('');
  descriptionControl = new FormControl('');

  @Output()
  descriptionChange = new EventEmitter<Description>();

  @Output()
  stepValidityChange = new EventEmitter<boolean>();

  ngOnInit() {
    // Initialize form controls with input values
    this.titleControl.setValue(this.description().title.value);
    this.descriptionControl.setValue(this.description().description.value);

    // Subscribe to form control changes
    this.titleControl.valueChanges.subscribe(value => {
      this.onTitleChange(value || '');
    });

    this.descriptionControl.valueChanges.subscribe(value => {
      this.onDescriptionChange(value || '');
    });
  }

  onTitleChange(newTitle: string) {
    this.description().title = {value: newTitle};
    this.descriptionChange.emit(this.description());
    this.stepValidityChange.emit(this.validateForm());
  }

  onDescriptionChange(newDescription: string) {
    this.description().description = {value: newDescription};
    this.descriptionChange.emit(this.description());
    this.stepValidityChange.emit(this.validateForm());
  }

  private validateForm(): boolean {
    return this.titleControl.valid && this.descriptionControl.valid;
  }
}
