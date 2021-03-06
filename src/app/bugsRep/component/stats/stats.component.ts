import { Component, OnDestroy, OnInit, ViewChild, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatSidenav } from '@angular/material/sidenav';
import { errors } from '../../4form/errTypes';
import { injections } from '../../4form/errInjection';
import { ErrTypes } from '../../4form/errTypes.interface';
import { Injection } from '../../4form/errInjection.interface';
import { StatsService } from 'src/app/service/stats.service';
import { Subscription } from 'rxjs';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SideFormActionService } from '../../service/side-form-action.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: [
    './stats.component.scss',
    '../bugs-rep-form/bugs-rep-form.component.scss',
    '../../container/main-view/main-view.container.scss'
  ]
})
export class StatsComponent implements OnInit, OnDestroy {
  
  //hande form
  errorsData: ErrTypes[];
  injectionsData: Injection[];
  range: FormGroup;
  date: Date;
  endDate: Date;
  //
  //Templete 1
  dateToErr: FormGroup;
  subTemp1: Subscription;
  dataTemp1: any = null;
  //view: any[] = [700, 400];
  selectedErr: string;
  yAxisLabel1: string;
  //
  //Template 2
  partToErr: FormGroup;
  range1: FormGroup;
  subTemp2: Subscription;
  dataTemp2: any = null;
  yAxisLabel2: string = 'liczba błędów';
  //
  //template 3
  circle: FormGroup;
  range2: FormGroup;
  subTemp3: Subscription;
  dataTemp3: any = null;
  //
  //data for forms - side
  action: boolean;
  subscription: Subscription;
  formOpened: boolean = true;

  //
  isMobile: boolean = false;
  //actions wchih have fluence on form
  @ViewChild('sidenav') sidenav: MatSidenav;
  //
  constructor(
    private fb: FormBuilder, 
    private dateAdapter: DateAdapter<Date>,
    private service: StatsService,
    private data: SideFormActionService) {
    this.dateAdapter.setLocale('pl');
  }
  @HostListener('document:fullscreenchange')
  @HostListener('webkitfullscreenchange')
  @HostListener('mozfullscreenchange')
  @HostListener('MSFullscreenChange')
  @HostListener('window:resize')
  async onResize() {
    if(window.visualViewport.width < 756) this.isMobile = true;
    else this.isMobile = false;
    await new Promise(f => setTimeout(f, 500));
    if(this.dataTemp1) this.show(1);
    if(this.dataTemp2) this.show(2);
    if(this.dataTemp3) this.show(3);
  }

  ngOnInit(): void {
    this.isMobile = window.visualViewport.width < 756;
    this.date=new Date();
    this.date.setHours(0);
    this.date.setMinutes(0);
    this.date.setSeconds(0);
    this.date.setMilliseconds(0);
    this.endDate = new Date();
    this.endDate.setHours(23);
    this.endDate.setMinutes(59);
    this.endDate.setSeconds(59);
    this.endDate.setMilliseconds(59);

    this.range = this.fb.group({
      start: this.date,
      end: this.endDate
    });
    this.range1 = this.fb.group({
      start: this.date,
      end: this.endDate
    });
    this.range2 = this.fb.group({
      start: this.date,
      end: this.endDate
    });
    this.dateToErr = this.fb.group({
      range: this.range,
      errType: [null, Validators.required],
      injType: [null, Validators.required]
    });
    this.partToErr = this.fb.group({
      range1: this.range1,
      carPart: [null, Validators.required],
      errType: [null, Validators.required]
    });
    this.circle = this.fb.group({
      range1: this.range2
    });
    this.errorsData = errors;
    this.injectionsData = injections;
    this.subTemp1 = this.service.dataTemp1$.subscribe(dataTemp1 => this.dataTemp1 = dataTemp1);
    this.subTemp2 = this.service.dataTemp2$.subscribe(dataTemp2 => this.dataTemp2 = dataTemp2);
    this.subTemp3 = this.service.dataTemp3$.subscribe(dataTemp3 => this.dataTemp3 = dataTemp3);
    this.subscription = this.data.currentAction.subscribe(action => {
      this.action = action;
      if(this.sidenav)
      {
        this.closeForm();
      }
    });
  }
  ngOnDestroy(){
    this.subTemp1.unsubscribe();
    this.dataTemp1 = null;    
    this.subTemp2.unsubscribe();
    this.dataTemp2 = null;    
    this.subTemp3.unsubscribe();
    this.dataTemp3 = null;
    this.subscription.unsubscribe();
  }
  closeForm()
  {
    this.sidenav.toggle();
    if(this.formOpened)
    {
      this.formOpened=false;
    }
    else
    {
      this.formOpened=true;
    }
    this.onResize();
  }
  today(chosen: any)
  {
    this.date=new Date();
    this.date.setHours(0);
    this.date.setMinutes(0);
    this.date.setSeconds(0);
    this.date.setMilliseconds(0);
    this.endDate =new Date();
    this.endDate.setHours(23);
    this.endDate.setMinutes(59);
    this.endDate.setSeconds(59);
    this.endDate.setMilliseconds(999);
    chosen.patchValue({
      start: this.date,
      end: this.endDate
    })
  }
  clear(form: FormGroup, data: number){
    form.reset();
    switch(data){
      case 1:{
        this.dataTemp1=null;
        break;
      }
      case 2:{
        this.dataTemp2=null;
        break;
      }
      case 3:{
        this.dataTemp3=null;
        break;
      }
    }
  }
  show(template: number){
    switch(template){
      case 1:{
        if(this.dateToErr.value.errType!='wtrącenia'){
          this.dateToErr.value.injType='-';
          this.dateToErr.patchValue({
            injType: '-'
          });
        }
        if(this.dateToErr.value.range.start && this.dateToErr.value.range.end && this.dateToErr.value.errType)
        {
          this.dateToErr.value.range.start.setMilliseconds(0);
          this.dateToErr.value.range.start.setSeconds(0);
          this.dateToErr.value.range.start.setMinutes(0);
          this.dateToErr.value.range.start.setHours(0);
          this.dateToErr.value.range.end.setMilliseconds(999);
          this.dateToErr.value.range.end.setSeconds(59);
          this.dateToErr.value.range.end.setMinutes(59);
          this.dateToErr.value.range.end.setHours(23);
          this.service.dateToErr(this.dateToErr.value);
          this.yAxisLabel1="Błąd: "+this.dateToErr.value.errType+"; Wtrącenie: "+this.dateToErr.value.injType;
        }
        break;
      }
      case 2:{
        if(this.partToErr.value.range1.start && 
          this.partToErr.value.range1.end && 
          this.partToErr.value.errType &&
          this.partToErr.value.errType.length>0 &&
          this.partToErr.value.carPart &&
          this.partToErr.value.carPart.length>0)
        {
          this.partToErr.value.range1.start.setMilliseconds(0);
          this.partToErr.value.range1.start.setSeconds(0);
          this.partToErr.value.range1.start.setMinutes(0);
          this.partToErr.value.range1.start.setHours(0);
          this.partToErr.value.range1.end.setMilliseconds(999);
          this.partToErr.value.range1.end.setSeconds(59);
          this.partToErr.value.range1.end.setMinutes(59);
          this.partToErr.value.range1.end.setHours(23);
          
          this.service.partToErr(this.partToErr.value);
          console.log(this.dataTemp2);
        }
        break;
      }
      case 3:{
        if(this.circle.value.range1.start && this.circle.value.range1.end)
        {
          this.circle.value.range1.start.setMilliseconds(0);
          this.circle.value.range1.start.setSeconds(0);
          this.circle.value.range1.start.setMinutes(0);
          this.circle.value.range1.start.setHours(0);
          this.circle.value.range1.end.setMilliseconds(999);
          this.circle.value.range1.end.setSeconds(59);
          this.circle.value.range1.end.setMinutes(59);
          this.circle.value.range1.end.setHours(23);
          
          this.service.circle(this.partToErr.value);
          console.log(this.dataTemp3);
        }
      }
    }
  }
}
