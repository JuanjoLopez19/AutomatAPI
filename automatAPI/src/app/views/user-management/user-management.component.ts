import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Sizes } from 'src/app/common/enums/enums';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit {
  readonly sizes: typeof Sizes = Sizes;
  currentSize!: string;
  active: string;
  constructor(private router: Router, private translate: TranslateService) {
    translate.addLangs(['en', 'es']);
    translate.setDefaultLang('es');
    translate.use('es');
    this.active = 'sign_in';
  }

  ngOnInit() {
    this.chooseSize(window.innerWidth);
    this.chooseLanguage(navigator.language);
  }

  // Resize Methods
  @HostListener('window:resize')
  onResize() {
    this.chooseSize(window.innerWidth);
  }

  chooseSize(width: number) {
    // 576 xs -> sm
    // 768 sm -> md
    // 1024 md -> lg
    // 1399 lg -> xl

    if (width < 576) {
      this.currentSize = Sizes.XS;
    } else if (width < 768) {
      this.currentSize = Sizes.SM;
    } else if (width < 1024) {
      this.currentSize = Sizes.MD;
    } else if (width < 1399) {
      this.currentSize = Sizes.LG;
    } else {
      this.currentSize = Sizes.XL;
    }
  }

  chooseLanguage(language: string) {
    this.translate.use(language);
  }

  onActiveChange(active: string) {
    this.active = active;
  }
}
