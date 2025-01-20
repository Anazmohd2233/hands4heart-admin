import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { CardDropdownOption } from '../../../shared/widget/card-title/card-title.model';

// type
import { ApexChartOptions } from '../../charts/apex/apex.model';
import { Channel, EngagementItem, SocialMediaItem, ViewsItem } from './analytics.model';

// data
import { CHANNELDATA, ENGAGEMENTDATA, SOCIALMEDIATRAFFIC, VIEWSPERMINUTE } from './data';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from 'src/app/apps/crm/services/course.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Course, CourseListResponse } from 'src/app/apps/crm/shared/crm.model';

@Component({
  selector: 'app-dashboard-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  courses: Course[] = [];
  apiUrl = "https://lms.zaap.life/admin/course/list/1";
  authToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiMSIsImlhdCI6MTczNzI4MzA5Nn0.OPDfT5xYyL09x2DYr2iVmldzHhq4OCsTm4RWE8wW12w";
    course: Course | null = null;
  

  constructor(private courseService: CourseService,
        private http: HttpClient,
        private route: ActivatedRoute,
    
  ) {}

  ngOnInit(): void {
  
    
    const courseId = localStorage.getItem('courseId');
    this._fetchData(courseId);
    
  }





  private _fetchData(courseId:any): void {
    console.log('Course id-----------------',courseId)

      const headers = new HttpHeaders({
        Authorization: this.authToken,
      });
  
      this.http.get<CourseListResponse>(this.apiUrl, { headers }).subscribe(
        (response) => {
          console.log('resssssssssssssssssssssssss',response)
          if (response.success) {
            if (response.success) {
              // Find the course by ID
              this.course = response.data.courses.find((course) => course.id == courseId.toString()) || null;
              if (this.course) {
                console.log('Course details::::::::::', this.course);
              } else {
                console.error('Course not found');
              }
            }
            console.log("Courses loaded:", this.courses);
          } else {
            console.error("Failed to load courses:", response.message);
          }
        },
        (error) => {
          console.error("API error:", error);
        }
      );
    }



}
