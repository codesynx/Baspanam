import {Injectable} from '@angular/core';
import {Category, CategoryName} from "./category.model";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private categories: Category[] = [
    {
      icon: "eye",
      displayName: "CATEGORIES.ALL",
      technicalName: "ALL",
      activated: false
    },
    {
      icon: "eye",
      displayName: "CATEGORIES.AMAZING_VIEWS",
      technicalName: "AMAZING_VIEWS",
      activated: false
    },
    {
      icon: "exclamation",
      displayName: "CATEGORIES.OMG",
      technicalName: "OMG",
      activated: false
    },
    {
      icon: "tree",
      displayName: "CATEGORIES.TREEHOUSES",
      technicalName: "TREEHOUSES",
      activated: false
    },
    {
      icon: "umbrella-beach",
      displayName: "CATEGORIES.BEACH",
      technicalName: "BEACH",
      activated: false
    },
    {
      icon: "tractor",
      displayName: "CATEGORIES.FARMS",
      technicalName: "FARMS",
      activated: false
    },
    {
      icon: "house",
      displayName: "CATEGORIES.TINY_HOMES",
      technicalName: "TINY_HOMES",
      activated: false
    },
    {
      icon: "water",
      displayName: "CATEGORIES.LAKE",
      technicalName: "LAKE",
      activated: false
    },
    {
      icon: "box",
      displayName: "CATEGORIES.CONTAINERS",
      technicalName: "CONTAINERS",
      activated: false
    },
    {
      icon: "tent",
      displayName: "CATEGORIES.CAMPING",
      technicalName: "CAMPING",
      activated: false
    },
    {
      icon: "chess-rook",
      displayName: "CATEGORIES.CASTLE",
      technicalName: "CASTLE",
      activated: false
    },
    {
      icon: "person-skiing",
      displayName: "CATEGORIES.SKIING",
      technicalName: "SKIING",
      activated: false
    },
    {
      icon: "fire",
      displayName: "CATEGORIES.CAMPERS",
      technicalName: "CAMPERS",
      activated: false
    },
    {
      icon: "snowflake",
      displayName: "CATEGORIES.ARCTIC",
      technicalName: "ARTIC",
      activated: false
    },
    {
      icon: "sailboat",
      displayName: "CATEGORIES.BOAT",
      technicalName: "BOAT",
      activated: false
    },
    {
      icon: "mug-saucer",
      displayName: "CATEGORIES.BED_AND_BREAKFASTS",
      technicalName: "BED_AND_BREAKFASTS",
      activated: false
    },
    {
      icon: "lightbulb",
      displayName: "CATEGORIES.ROOMS",
      technicalName: "ROOMS",
      activated: false
    },
    {
      icon: "earth-europe",
      displayName: "CATEGORIES.EARTH_HOMES",
      technicalName: "EARTH_HOMES",
      activated: false
    },
    {
      icon: "tower-observation",
      displayName: "CATEGORIES.TOWER",
      technicalName: "TOWER",
      activated: false
    },
    {
      icon: "hill-rockslide",
      displayName: "CATEGORIES.CAVES",
      technicalName: "CAVES",
      activated: false
    },
    {
      icon: "champagne-glasses",
      displayName: "CATEGORIES.LUXES",
      technicalName: "LUXES",
      activated: false
    },
    {
      icon: "kitchen-set",
      displayName: "CATEGORIES.CHEFS_KITCHEN",
      technicalName: "CHEFS_KITCHEN",
      activated: false
    },
  ];

  private changeCategory$ = new BehaviorSubject<Category>(this.getCategoryByDefault());
  changeCategoryObs = this.changeCategory$.asObservable();

  changeCategory(category: Category): void {
    this.changeCategory$.next(category);
  }

  getCategories(): Category[] {
    return this.categories;
  }

  getCategoryByDefault() {
    return this.categories[0];
  }

  getCategoryByTechnicalName(technicalName: CategoryName): Category | undefined {
    return this.categories.find(category => category.technicalName === technicalName);
  }
}
