import { Component, OnInit } from '@angular/core';

// type
import { BreadcrumbItem } from '../../shared/page-title/page-title.model';
import { ChatUser } from './shared/chat.model';

// data
import { USERS } from './shared/data';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Banner, BannerListResponse } from './banner/banner.module';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  banners: Banner[] = [];

  pageTitle: BreadcrumbItem[] = [];

  apiUrl = "https://lms.zaap.life/admin/banner/list/1";
  authorization :any; 



  constructor (
    private http: HttpClient,
        private sanitizer: DomSanitizer,
    
  ) { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Apps', path: '/' }, { label: 'Chat', path: '/', active: true }];

    this.authorization = localStorage.getItem("Authorization");

    this._fetchData();

    // set initial user
   
  }

  private _fetchData(): void {
    const headers = new HttpHeaders({
      Authorization: this.authorization,
    });

    this.http.get<BannerListResponse>(this.apiUrl, { headers }).subscribe(
      (response) => {
        if (response.success) {
          this.banners = response.data.banner;
          console.log("Courses loaded:", this.banners);
        } else {
          console.error("Failed to load courses:", response.message);
        }
      },
      (error) => {
        console.error("API error:", error);
      }
    );
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


}
