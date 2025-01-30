import {Component, effect, inject, OnDestroy, OnInit} from '@angular/core';
import {BookingService} from "../service/booking.service";
import {ToastService} from "../../layout/toast.service";
import {BookedListing} from "../model/booking.model";
import {CardListingComponent} from "../../shared/card-listing/card-listing.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-booked-listing',
  standalone: true,
  imports: [
    TranslateModule,
    CardListingComponent,
    FaIconComponent
  ],
  templateUrl: './booked-listing.component.html',
  styleUrl: './booked-listing.component.scss'
})
export class BookedListingComponent implements OnInit, OnDestroy {

  bookingService = inject(BookingService);
  toastService = inject(ToastService);
  translate = inject(TranslateService);
  bookedListings = new Array<BookedListing>();

  loading = false;

  constructor() {
    this.listenFetchBooking();
    this.listenCancelBooking()
  }

  ngOnDestroy(): void {
    this.bookingService.resetCancel();
  }

  ngOnInit(): void {
    this.fetchBooking();
  }

  private fetchBooking() {
    this.loading = true;
    this.bookingService.getBookedListing();
  }

  onCancelBooking(bookedListing: BookedListing) {
    bookedListing.loading = true;
    this.bookingService.cancel(bookedListing.bookingPublicId, bookedListing.listingPublicId, false);
  }

  private listenFetchBooking() {
    effect(() => {
      const bookedListingsState = this.bookingService.getBookedListingSig();
      if (bookedListingsState.status === "OK") {
        this.loading = false;
        this.bookedListings = bookedListingsState.value!;
      } else if(bookedListingsState.status === "ERROR") {
        this.loading = false;
        this.toastService.send({
          severity: "error", 
          summary: this.translate.instant('COMMON.ERROR'),
          detail: this.translate.instant('ERRORS.GET_LISTING'),
        });
      }
    });
  }

  private listenCancelBooking() {
    effect(() => {
      const cancelState = this.bookingService.cancelSig();
      if (cancelState.status === "OK") {
        const listingToDeleteIndex = this.bookedListings.findIndex(
          listing => listing.bookingPublicId === cancelState.value
        );
        this.bookedListings.splice(listingToDeleteIndex, 1);
        this.toastService.send({
          severity: "success", 
          summary: this.translate.instant('COMMON.SUCCESS'),
          detail: this.translate.instant('BOOKINGS.CANCEL_SUCCESS'),
        });
      } else if (cancelState.status === "ERROR") {
        const listingToDeleteIndex = this.bookedListings.findIndex(
          listing => listing.bookingPublicId === cancelState.value
        );
        this.bookedListings[listingToDeleteIndex].loading = false;
        this.toastService.send({
          severity: "error", 
          summary: this.translate.instant('COMMON.ERROR'),
          detail: this.translate.instant('ERRORS.CANCEL_BOOKING'),
        });
      }
    });
  }
}
