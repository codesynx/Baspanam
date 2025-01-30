import {Component, effect, inject, OnInit} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {ToolbarModule} from "primeng/toolbar";
import {MenuModule} from "primeng/menu";
import {CategoryComponent} from "./category/category.component";
import {AvatarComponent} from "./avatar/avatar.component";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {MenuItem} from "primeng/api";
import {ToastService} from "../toast.service";
import {AuthService} from "../../core/auth/auth.service";
import {User} from "../../core/model/user.model";
import {PropertiesCreateComponent} from "../../landlord/properties-create/properties-create.component";
import {SearchComponent} from "../../tenant/search/search.component";
import {ActivatedRoute} from "@angular/router";
import dayjs from "dayjs";
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    ButtonModule,
    FontAwesomeModule,
    ToolbarModule,
    MenuModule,
    CategoryComponent,
    AvatarComponent,
    DropdownModule,
    FormsModule,
    TranslateModule
  ],
  providers: [DialogService],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

  location = 'NAVBAR.LOCATION';
  guests = 'NAVBAR.GUESTS';
  dates = 'NAVBAR.DATES';

  toastService = inject(ToastService);
  authService = inject(AuthService);
  dialogService = inject(DialogService);
  activatedRoute = inject(ActivatedRoute);
  ref: DynamicDialogRef | undefined;

  login = () => this.authService.login();

  logout = () => this.authService.logout();

  currentMenuItems: MenuItem[] | undefined = [];

  connectedUser: User = {email: this.authService.notConnected};

  languages = [
    { code: 'kk', name: 'Қазақша' },
    { code: 'ru', name: 'Русский' },
    { code: 'en', name: 'English' }
  ];
  
  currentLang: string;

  constructor(
    private translate: TranslateService
  ) {
    this.currentLang = this.translate.currentLang || 'kk';
    this.translate.use(this.currentLang);
    effect(() => {
      if (this.authService.fetchUser().status === "OK") {
        this.connectedUser = this.authService.fetchUser().value!;
        this.currentMenuItems = this.fetchMenu();
      } else {
        this.currentMenuItems = this.fetchMenu();
      }
    });
  }

  ngOnInit(): void {
    this.authService.fetch(false);
    this.extractInformationForSearch();
  }

  private fetchMenu(): MenuItem[] {
    if (this.authService.isAuthenticated()) {
      return [
        {
          label: this.translate.instant('NAVBAR.PROPERTIES'),
          routerLink: "landlord/properties",
          visible: this.hasToBeLandlord(),
        },
        {
          label: this.translate.instant('NAVBAR.BOOKINGS'),
          routerLink: "booking",
        },
        {
          label: this.translate.instant('NAVBAR.RESERVATIONS'),
          routerLink: "landlord/reservation",
          visible: this.hasToBeLandlord(),
        },
        {
          label: this.translate.instant('NAVBAR.LOGOUT'),
          command: this.logout
        },
      ]
    } else {
      return [
        {
          label: this.translate.instant('NAVBAR.REGISTER'),
          styleClass: "font-bold",
          command: this.login
        },
        {
          label: this.translate.instant('NAVBAR.LOGIN'),
          command: this.login
        }
      ]
    }
  }

  hasToBeLandlord(): boolean {
    return this.authService.hasAnyAuthority("ROLE_LANDLORD");
  }

  openNewListing(): void {
    this.ref = this.dialogService.open(PropertiesCreateComponent,
      {
        width: "60%",
        header: this.translate.instant('NAVBAR.RENT_OUT'),
        closable: true,
        focusOnShow: true,
        modal: true,
        showHeader: true
      })
  }

  openNewSearch(): void {
    this.ref = this.dialogService.open(SearchComponent,
      {
        width: "40%",
        header: "Search",
        closable: true,
        focusOnShow: true,
        modal: true,
        showHeader: true
      });
  }

  private extractInformationForSearch(): void {
    this.activatedRoute.queryParams.subscribe({
      next: params => {
        if (params["location"]) {
          this.location = params["location"];
          this.guests = params["guests"] + " " + this.translate.instant('NAVBAR.GUESTS');
          this.dates = dayjs(params["startDate"]).format("MMM-DD")
            + " - " + dayjs(params["endDate"]).format("MMM-DD");
        } else if (this.location !== this.translate.instant('NAVBAR.LOCATION')) {
          this.location = this.translate.instant('NAVBAR.LOCATION');
          this.guests = this.translate.instant('NAVBAR.GUESTS');
          this.dates = this.translate.instant('NAVBAR.DATES');
        }
      }
    })
  }

  changeLanguage(event: { value: string }) {
    this.translate.use(event.value);
    this.currentLang = event.value;
    this.extractInformationForSearch();
    this.currentMenuItems = this.fetchMenu();
  }
}
