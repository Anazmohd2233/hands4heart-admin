import { AfterViewChecked, Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AdvancedTableServices } from './advanced-table-service.service';
import { NgbSortableHeaderDirective, SortEvent } from './sortable.directive';
import { Router } from '@angular/router';
import { EnrolledCourse } from '../models/mode-user-courses';
import { UserProfileService } from 'src/app/core/service/user.service';


export interface Column {
  name: string;
  label: string;
  formatter: (a: any) => any | string;
  sort?: boolean;
  width?: number;

}


@Component({
  selector: 'app-advanced-table-users',
  templateUrl: './advanced-table.component.html',
  styleUrls: ['./advanced-table.component.scss'],
  providers: [AdvancedTableServices]
})
export class AdvancedTableComponent implements OnInit, AfterViewChecked {


  @Input() pagination: boolean = false;
  @Input() isSearchable: boolean = false;
  @Input() isSortable: boolean = false;
  @Input() pageSizeOptions: number[] = [];
  @Input() tableData: any[] = [];
  @Input() tableClasses: string = '';
  @Input() theadClasses: string = '';
  @Input() hasRowSelection: boolean = false;
  @Input() columns: Column[] = [];
  collectionSize: number = this.tableData.length;
  selectAll: boolean = false;
  isSelected: boolean[] = [];


  @Output() search = new EventEmitter<string>();
  @Output() sort = new EventEmitter<SortEvent>();
  @Output() handleTableLoad = new EventEmitter<void>();


  @ViewChildren(NgbSortableHeaderDirective) headers!: QueryList<NgbSortableHeaderDirective>;
  @ViewChildren('advancedTable') advancedTable!: any;

  constructor (
    public service: AdvancedTableServices, 
    private sanitizer: DomSanitizer, 
    private componentFactoryResolver: ComponentFactoryResolver,
    private router: Router,
    private userService: UserProfileService,
  ) {}

  ngAfterViewChecked(): void {
    this.handleTableLoad.emit();

  }

  ngOnInit(): void {
    for (let i = 0; i < this.tableData.length; i++) {
      this.isSelected[i] = false;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.paginate();
  }

  /**
   * sets pagination configurations
   */
  paginate(): void {
    // paginate
    this.service.totalRecords = this.tableData.length;
    if (this.service.totalRecords === 0) {
      this.service.startIndex = 0;
    }
    else {
      this.service.startIndex = ((this.service.page - 1) * this.service.pageSize) + 1;
    }
    this.service.endIndex = Number((this.service.page - 1) * this.service.pageSize + this.service.pageSize);
    if (this.service.endIndex > this.service.totalRecords) {
      this.service.endIndex = this.service.totalRecords;
    }
  }


  /**
   * Search Method
  */
  searchData(): void {
    this.search.emit(this.service.searchTerm);

  }


  /**
   * sorts column
   * @param param0 column name,sort direction
   */
  onSort({ column, direction }: SortEvent): void {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;

    this.sort.emit({ column, direction });
  }

  /**
   *  calls formatter function for table cells
   * @param column column name
   * @param data data of column
   */
  callFormatter(column: Column, data: any): any {

    return (column.formatter(data));
  }

  /**
   * @returns intermediate status of selectAll checkbox
   */
  checkIntermediate(): boolean {
    let selectedRowCount = this.isSelected.filter(x => x === true).length;
    if (!this.selectAll && selectedRowCount > 0 && selectedRowCount < this.tableData.length) {
      return true;
    }
    else {
      return false;
    }
  }

  /**
   * select all row
   * @param event event
   */
  selectAllRow(event: any): void {
    this.selectAll = !this.selectAll;
    if (this.selectAll) {
      for (let i = 0; i < this.tableData.length; i++) {
        this.isSelected[i] = true;
      }
    }
    else {
      for (let i = 0; i < this.tableData.length; i++) {
        this.isSelected[i] = false;
      }
    }
  }

  /**
   * selects row
   * @param index row index
   */
  selectRow(index: number): void {
    this.isSelected[index] = !this.isSelected[index];
    this.selectAll = (this.isSelected.filter(x => x === true).length === this.tableData.length);
  }


  openCourses(record: any): void {
    console.log('Open courses for:', record);
    localStorage.setItem("userId_course", record.id); // Save URLs only

    this.router.navigate([`apps/user-courses`]);
    // Add your logic here to open the Courses page/modal for the selected user.
  }

  updatePaymentStatus(record: EnrolledCourse, status: string): void {
    console.log(`Updating payment status for ${record.user_name}:`, status);

    const formData = new FormData();
    formData.append("enroll_id", record.id);
    formData.append("payment_type", status);
  
    // Perform additional logic, e.g., API call to update the backend
    this._fetchData(formData);
  }
  
  _fetchData(formData:any): void {
    // this.records = tableData;


    this.userService.updatePaymentStatus(formData).subscribe({
      next: (response) => 
        {console.log('response of user list - ',response)
        if (response) {
          console.log('succcessssssssssssssssssssssss')
        } else {
          console.error('Failed to fetch data:');
        }
      },
      error: (error) => {
        console.error('Error fetching admin list:', error);
      },
      complete: () => {
        // Optionally handle the completion logic here
        console.log('Admin list fetch completed.');
      }
    });
    
  }
  

}

