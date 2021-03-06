import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { TabsComponent } from '../tabs/tabs.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  viewProviders: [TabsComponent]
})
export class NavbarComponent implements OnInit {

  @Input() links: Array<any>;
  index: number;
  action: boolean = false;
  @Output() tabChanging = new EventEmitter<number>();
  @Output() formStatusChanging = new EventEmitter<boolean>();
  @Output() logOut = new EventEmitter<any>();
  isMobile: boolean = false;
  @HostListener('document:fullscreenchange')
  @HostListener('webkitfullscreenchange')
  @HostListener('mozfullscreenchange')
  @HostListener('MSFullscreenChange')
  @HostListener('window:resize')
  async onResize() {
    //await new Promise(f => setTimeout(f, 500));
    if(window.visualViewport.width < 1002) this.isMobile = true;
    else this.isMobile = false;
  }
  constructor() { }

  ngOnInit(): void {
    this.onResize();
  }
  transferToContainer($event): void
  {
    this.index=$event;
    this.tabChanging.emit(this.index);
  }
  changeFormStatus(): void{
    if(this.action)
    {
      this.formStatusChanging.emit(false);
      this.action=true;
    }
    else
    {
      this.formStatusChanging.emit(true);
      this.action=false;
    }
  }
  logout(){
    this.logOut.emit();
  }
}
