export interface PerformanceListItem {
    id?: number;
    name?: string;
    position?: string;
    leads?: number;
    deals?: number;
    tasks?: number;
}

export interface LeadItem {
    id?: number;
    name?: string;
    email?: string;
    profile?: string;
    badge?: {
        variant: string;
        text: string;
    }
}

export interface Order {
    id: number;
    orderId: string;
    customer: {
        avatar: string;
        name: string;
    },
    project: string;
    address: {
        city: string;
        country: string;
    },
    orderDate: string;
    orderStatus: string;
}

export interface Client {
    name: string;
    email?: string;
    avatar: string;
    completedProjects?: number;
    verifiedClient?: boolean;
    company?: string;
    date?: string;
}

export interface CourseDetails {
    id: string;
    video_url: string;
    img: string;
    name: string;
    status: number;
    createdAt: string;
    course_id: string;
  }
  
  export interface Course {
    id: string;
    name: string;
    description: string;
    img: string | null;
    status: number;
    createdAt: string;
    updatedAt: string;
    details: CourseDetails[];
  }
  
  export interface CourseListResponse {
    success: boolean;
    message: string;
    instance: string;
    data: {
      courses: Course[];
      total_count: number;
      limit: number;
    };
  }
  

export interface TeamMember {
    avatar: string;
    name: string;
    designation: string;
    experience: string;
}

export interface DailyTask {
    title: String;
    shortDesc: String;
    time: String;
    teamSize: number;
}

export interface OverviewItem {
    title: string;
    totalProjects: number;
    totalEmployees: number;
    variant: string;
}

export interface Statistics {
    icon: string;
    variant: string;
    title: string;
    stats: number;
}

export interface Project {
    name: string;
    task: string;
    createdOn?: string;
    teamMembers: string[];
}

export interface Task {
    icon: string,
    variant: string,
    title: string,
    totalTask?: number,
    completedTask?: number,
    progressValue: number,
}

export interface MonthlyProgressItem {
    avatar: string,
    name: string,
    emailId: string,
    projectName: string,
    status: string,
}

export interface ManagementProject {
    icon: string,
    variant: string,
    title: string,
    subTitle: string,
    hours: number,
    task: number,
    assignTo: string[],
}

