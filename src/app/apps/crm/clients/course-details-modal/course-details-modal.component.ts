import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-course-details-modal',
  templateUrl: './course-details-modal.component.html',
  styleUrls: ['./course-details-modal.component.scss']
})
export class CourseDetailsModalComponent implements OnInit {


  ngOnInit(): void {
  }

  @Input() courseDetails: any; // Pass the details object from parent

  constructor(private sanitizer: DomSanitizer) {}

  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  closeModal(): void {
    // Custom logic to close the modal, e.g., emitting an event
  }

}
