import {Component, inject, OnInit, ViewChild, ElementRef, AfterViewInit, HostListener} from '@angular/core';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {CategoryService} from "./category.service";
import {Category, CategoryName} from "./category.model";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter, map} from "rxjs";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    FontAwesomeModule,
    TranslateModule
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit, AfterViewInit {
  @ViewChild('categoriesContainer') categoriesContainer!: ElementRef;

  categoryService = inject(CategoryService);

  categories: Category[] | undefined;

  currentActivateCategory = this.categoryService.getCategoryByDefault();

  isHome = false;
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  scrollStep = 100; // Amount to scroll per wheel event

  ngOnInit(): void {
    this.listenRouter();
    this.currentActivateCategory.activated = false;
    this.fetchCategories();
  }

  ngAfterViewInit() {
    // No need for setupHorizontalScroll here as we're using HostListener
  }

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    const container = this.categoriesContainer.nativeElement;
    if (event.deltaY !== 0) {
      event.preventDefault();
      container.scrollLeft += event.deltaY + event.deltaX;
    }
  }

  private fetchCategories() {
    this.categories = this.categoryService.getCategories();
  }

  private listenRouter() {
    this.router.events.pipe(
      filter((evt): evt is NavigationEnd => evt instanceof NavigationEnd)
    )
      .subscribe({
        next: (evt: NavigationEnd) => {
          this.isHome = evt.url.split("?")[0] === "/";
          if (this.isHome && evt.url.indexOf("?") === -1) {
            const categoryByTechnicalName = this.categoryService.getCategoryByTechnicalName("ALL");
            this.categoryService.changeCategory(categoryByTechnicalName!);
          }
        },
      });

    this.activatedRoute.queryParams
      .pipe(
        map(params => params["category"])
      )
      .subscribe({
        next: (categoryName: CategoryName) => {
          const category = this.categoryService.getCategoryByTechnicalName(categoryName);
          if (category) {
            this.activateCategory(category);
            this.categoryService.changeCategory(category);
          }
        }
      })
  }

  private activateCategory(category: Category) {
    this.currentActivateCategory.activated = false;
    this.currentActivateCategory = category;
    this.currentActivateCategory.activated = true;
  }

  onChangeCategory(category: Category) {
    this.activateCategory(category);
    this.router.navigate([], {
      queryParams: {"category": category.technicalName},
      relativeTo: this.activatedRoute
    })
  }
}
