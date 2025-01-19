import { Component, OnInit } from '@angular/core';

// types
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { Client, Course, CourseListResponse } from '../shared/crm.model';

// data
import { CLIENTS } from './data';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalContentComponent } from './modal-content/modal-content.component';

@Component({
  selector: 'app-crm-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class CRMClientsComponent implements OnInit {



  courses: Course[] = [];
  apiUrl = 'https://lms.zaap.life/admin/course/list/1';
  authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiMSIsImlhdCI6MTczNzI4MzA5Nn0.OPDfT5xYyL09x2DYr2iVmldzHhq4OCsTm4RWE8wW12w';



  pageTitle: BreadcrumbItem[] = [];
 


  constructor (private http: HttpClient , public modalService: NgbModal) { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'CRM', path: '/' }, { label: 'Clients List', path: '/', active: true }];
    this._fetchData();
  }

  /**
   * fetches order list
   */
  private _fetchData(): void {
    const headers = new HttpHeaders({
      Authorization: this.authToken,
    });

    this.http.get<CourseListResponse>(this.apiUrl, { headers }).subscribe(
      (response) => {
        if (response.success) {
          this.courses = response.data.courses;
          console.log('Courses loaded:', this.courses);
        } else {
          console.error('Failed to load courses:', response.message);
        }
      },
      (error) => {
        console.error('API error:', error);
      }
    );
  }


  public user = {
    name: 'Izzat Nadiri',
    age: 26
  }

  openModal(details: any) {
    console.log('course details', details);
  
    const modalRef = this.modalService.open(ModalContentComponent, { size: 'lg' });
  
    // Pass the details to the modal
    modalRef.componentInstance.details = details; // Passing the details
  
    modalRef.result.then((result) => {
      if (result) {
        console.log(result);
      }
    });
  }


    // modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
    //   console.log(receivedEntry);
    // })
  
}
