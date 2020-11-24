import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageSizes, PaginatorState } from '../../models/paginator.model';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {
  @Input() paginator: PaginatorState;
  @Input() isLoading;
  @Output() paginate: EventEmitter<PaginatorState> = new EventEmitter();
  pageSizes: number[] = PageSizes;
  constructor() {}

  ngOnInit(): void {
     this.paginator.finish = +this.paginator.pageSize
  }


  pageChange(num: number) {
    this.paginator.page = num;
    this.paginator.first = (num -1) * this.paginator.pageSize + 1;
    if (this.paginator.first + this.paginator.pageSize - 1  < this.paginator.total) {
      this.paginator.finish = this.paginator.first + this.paginator.pageSize - 1 ;
    } else {
      this.paginator.finish = this.paginator.total;
    }
    this.paginate.emit(this.paginator);
  }

  sizeChange() {
    this.paginator.pageSize = +this.paginator.pageSize;
    this.paginator.page = 1;
    this.paginator.first = 1;
    if (this.paginator.first + this.paginator.pageSize - 1  < this.paginator.total) {
      this.paginator.finish = this.paginator.first + this.paginator.pageSize - 1 ;
    } else {
      this.paginator.finish = this.paginator.total;
    }
    this.paginate.emit(this.paginator);
  }
}
