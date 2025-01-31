import { Component, OnInit, TemplateRef } from "@angular/core";

// types
import { BreadcrumbItem } from "src/app/shared/page-title/page-title.model";

// data

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { CourseService } from "../services/course.service";
import { Course, CourseListResponse } from "../../chat/banner/banner.module";
import { QuizService } from "src/app/core/service/quiz.service";
import { AdminItem } from "./model";

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {

addCourseForm!: FormGroup;
courseForm!: FormGroup;


  courses: Course[] = [];
  quizData: AdminItem[] = [];
  courseName: string | null = null;

  selectedCourse:any;


  apiUrl = "https://lms.zaap.life/admin/course/list/1";

  pageTitle: BreadcrumbItem[] = [];


  authorization: any;

  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private router: Router,
    private courseService: CourseService,
    private quizService: QuizService,
  ) {}

  ngOnInit(): void {
    this.authorization = localStorage.getItem("Authorization");

    this.pageTitle = [
      { label: "CRM", path: "/" },
      { label: "Clients List", path: "/", active: true },
    ];
    this._fetchData();

    this.fetchData();

    this.addCourseForm = this.fb.group({
      name: ["", Validators.required],
      description: ["", Validators.required],
      course: ["", Validators.required],
    });

    this.courseForm = new FormGroup({
      course: new FormControl(this.courses.length ? this.courses[0].id : '') // Default to first course
    });

  }

  /**
   * fetches order list
   */
  private _fetchData(): void {
    const headers = new HttpHeaders({
      Authorization: this.authorization,
    });

    this.http.get<CourseListResponse>(this.apiUrl, { headers }).subscribe(
      (response) => {
        if (response.success) {
          this.courses = response.data.courses;
          this.selectedCourse = this.courses.length ? this.courses[0].id : ''; // Set first course as default

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

  private fetchData(): void {
  

    this.quizService.getQuiz(1).subscribe({
      next: (response) => {

        console.log("Quiz list:", response);
        this.quizData = response.data.admin_list;
        this.courseName = response.data.admin_list[0].course.name;

      },
      error: (error) => {
        console.error("Error fetching quiz:", error);
      },
    });

    
  }

  public user = {
    name: "Izzat Nadiri",
    age: 26,
  };

  open(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content, { scrollable: true });
  }

 

  onSubmitCreateQuiz(): void {
    if (this.addCourseForm.valid) {
      const formData = new FormData();

      // Add scalar values
      formData.append("title", this.addCourseForm.value.name);
      formData.append("description", this.addCourseForm.value.description);
      formData.append("course_id", this.addCourseForm.value.course);


        this.quizService.createQuiz(formData).subscribe({
          next: (response) => {
            console.log("response of create Quiz - ", response);
            if (response.success) {
              this.resetForm();
             
            } else {
              console.error("Failed to create Quiz:", response.success);
            }
          },
          error: (error) => {
            console.error("Error creating Quiz:", error);
          },
          complete: () => {
            this.fetchData();
            console.log("Quiz created successfully!...");
          },
        });
    }
  }
  resetForm() {
    this.addCourseForm.reset({
      name: "",
      description: "",
      course: "",
    });

  }

  goToQuestions(quiz: any): void {
   console.log('course question add:::::;;;',quiz)
    // localStorage.setItem("courseId", course.id); // Save URLs only
    // this.router.navigate([`courses/details/${course.id}`]);
  }

  fetchCourseDetails(event: Event) {
    const selectedCourseId = (event.target as HTMLSelectElement).value;
    console.log('course id from dropdown', selectedCourseId)

  if(selectedCourseId){
    this.quizService.getQuiz(selectedCourseId).subscribe({
      next: (response) => {
        console.log("Quiz list:", response);
        this.quizData = response.data.admin_list;
        this.courseName = response.data.admin_list[0].course.name;
      },
      error: (error) => {
        console.error("Error fetching quiz:", error);
      },
    });
  }
   

  }
  

}
