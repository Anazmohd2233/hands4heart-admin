import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-content',
  templateUrl: './modal-content.component.html',
  styleUrls: ['./modal-content.component.scss']
})
export class ModalContentComponent implements OnInit {

  @Input() details: any; // Receiving details from parent component
  // @Input() details: any[] = []; // Receiving details array from parent component



  constructor() { }

  ngOnInit(): void {
  }

}
