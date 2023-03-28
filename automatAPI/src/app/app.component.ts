import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'automatAPI';

  constructor(
    private primengConfig: PrimeNGConfig,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon(
      'flask',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/flask_svg.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'express',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/express_svg.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'django',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/django_svg.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'service_app',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/services_svg.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'webapp',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/webapp_svg.svg'
      )
    );
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
  }
}
