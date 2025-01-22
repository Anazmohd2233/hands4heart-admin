import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import {
  NgbCalendar,
  NgbDateStruct,
  NgbModal,
} from "@ng-bootstrap/ng-bootstrap";
import { CardDropdownOption } from "../../../shared/widget/card-title/card-title.model";

// type
import { ApexChartOptions } from "../../charts/apex/apex.model";
import {
  Channel,
  EngagementItem,
  SocialMediaItem,
  ViewsItem,
} from "./analytics.model";

// data
import {
  CHANNELDATA,
  ENGAGEMENTDATA,
  SOCIALMEDIATRAFFIC,
  VIEWSPERMINUTE,
} from "./data";
import { ActivatedRoute, Router } from "@angular/router";
import { CourseService } from "src/app/apps/crm/services/course.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  Course,
  CourseDataById,
  CourseListResponse,
  CourseModalResponseById,
} from "src/app/apps/chat/banner/banner.module";

@Component({
  selector: "app-dashboard-analytics",
  templateUrl: "./analytics.component.html",
  styleUrls: ["./analytics.component.scss"],
})
export class AnalyticsComponent implements OnInit {
  addCourseDetailsForm!: FormGroup;

  courses: CourseDataById[] = [];

  course: CourseDataById | null = null;

  files: File | null = null; // Single file object

  docs: File | null = null;

  courseId: string | null = null; // Class property to hold courseId
  authorization: any;

  constructor(
    private courseService: CourseService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.courseId = localStorage.getItem("courseId");
    this.authorization = localStorage.getItem("Authorization");
    this.fetchCourseDetails(this.courseId);

    this.addCourseDetailsForm = this.fb.group({
      name: ["", Validators.required],
      video_url: ["", Validators.required],
      status: ["", Validators.required],
    });
  }
  fetchCourseDetails(courseId: any): void {
    const apiUrl = `https://lms.zaap.life/admin/course/view?id=${courseId}`;
    const token = this.authorization;

    this.http
      .get<CourseModalResponseById>(apiUrl, {
        headers: { Authorization: token },
      })
      .subscribe((response) => {
        console.log("Course details:", response);
        this.course = response.data;
      });
  }

  getEmbedUrl(videoUrl: string): SafeResourceUrl {
    const videoId = this.getYouTubeVideoId(videoUrl);
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  // Extract the video ID from YouTube URL
  private getYouTubeVideoId(url: string): string {
    const match = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
    return match ? match[1] : ""; // return video ID or empty string
  }

  getTrustedUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  open(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content, { scrollable: true });
  }

  resetForm() {
    this.addCourseDetailsForm.reset({
      name: "",
      video_url: "",
      status: "",
    });
    this.files = null;
  }
  onSelectImage(event: any): void {
    if (event.addedFiles && event.addedFiles.length > 0) {
      this.files = event.addedFiles[0]; // Store only the first selected file
    }
  }

  /**
   * removes file from uploaded files
   * @param event event
   */
  onRemoveFile(event: any) {
    // this.files.splice(this.files.indexOf(event), 1);
    this.files = null; // Clear the file
  }

  /**
   * Formats the size
   */
  getSize(f: File) {
    const bytes = f.size;
    if (bytes === 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const dm = 2;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  /**
   * returns preview url of uploaded file
   */
  getPreviewUrlImg(f: File) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      encodeURI(URL.createObjectURL(f))
    );
  }

  createCourseDetails(): void {
    if (this.addCourseDetailsForm.valid) {
      const formData = new FormData();

      // Add scalar values
      formData.append("name", this.addCourseDetailsForm.value.name);
      formData.append("video_url", this.addCourseDetailsForm.value.video_url);
      formData.append("status", this.addCourseDetailsForm.value.status);
      if (this.courseId) {
        formData.append("course_id", this.courseId);
      }

      // Add course_objective as a stringified JSON

      if (this.files) {
        formData.append("course_details_img", this.files); // Single file for course image
      }

      // Send POST request
      this.http
        .post("https://lms.zaap.life/admin/course/create_details", formData, {
          headers: {
            Authorization: this.authorization,
          },
        })
        .subscribe((response) => {
          console.log("Course created successfully", response);
          this.resetForm();
        });
    }
  }
}
