import { Injectable, OnDestroy } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import {
  Router,
  ActivatedRouteSnapshot,
  ActivationEnd,
  NavigationStart,
  NavigationEnd,
} from '@angular/router';
import { Subject, of } from 'rxjs';
import {
  filter,
  map,
  takeUntil,
  take,
  switchMap,
  mergeMap,
  switchAll,
  shareReplay,
  skip,
} from 'rxjs/operators';

/**
 * This service stores and restores the scroll position of a certain
 * route.
 *
 * In the `data` object of the route of which the scroll position
 * should be restored, add a `restoreScrollPositionFrom` option – an array with
 * absolute URLs. This enables the restoring of the scroll position,
 * when navigating back from one of these URLs.
 *
 * In addition to this, the component for which the scroll position
 * should be restored must call the `restore()` function the service
 * in the `ngAfterViewInit` lifecycle function (i.e. when the content
 * is rendered).
 *
 * Example:
 *   const routes: Routes = [
 *     {
 *       path: 'list',
 *       data: { restoreScrollPositionFrom: ['/detail'] },
 *       component: ListComponent
 *     },
 *     { path: 'detail', component: DetailComponent }
 *   ];
 *
 *   class ListComponent implements AfterViewInit {
 *     constructor(private scrollPosition: ScrollPositionService) {}
 *
 *     ngAfterViewInit(): void {
 *       this.scrollPosition.restore();
 *     }
 *   }
 */
@Injectable({
  providedIn: 'root',
})
export class ScrollPositionService implements OnDestroy {
  private scrollPositions: Dict<[number, number]> = {};

  private previousRoute: Option<ActivatedRouteSnapshot> = null;
  private currentRoute: Option<ActivatedRouteSnapshot> = null;
  private currentScrollPosition: [number, number] = [0, 0];

  private destroy$ = new Subject<void>();

  // Determine the scroll position when the navigation starts and the
  // "old" component is still correctly rendered
  private scrollPosition$ = this.router.events.pipe(
    filter(isNavigationStart),
    map(this.getScrollPosition.bind(this))
  );

  private activationEnd$ = this.router.events.pipe(filter(isActivationEnd));
  private navigationEnd$ = this.router.events.pipe(filter(isNavigationEnd));

  // On each NavigationEnd, emit the first ActivationEnd (there may be
  // multiple for a single navigation)
  private route$ = this.activationEnd$.pipe(take(1)).pipe(
    mergeMap((first) => [
      of(first),
      this.navigationEnd$.pipe(
        switchMap(() => this.activationEnd$.pipe(take(1)))
      ),
    ]),
    switchAll(),
    map((event) => event.snapshot),
    shareReplay(1)
  );

  constructor(
    private router: Router,
    private viewportScroller: ViewportScroller
  ) {
    this.scrollPosition$
      .pipe(takeUntil(this.destroy$))
      .subscribe((position) => (this.currentScrollPosition = position));

    this.route$.pipe(takeUntil(this.destroy$)).subscribe((route) => {
      this.previousRoute = this.currentRoute;
      this.currentRoute = route;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  restore(): void {
    if (!this.currentRoute || !this.requiresStoring(this.currentRoute)) {
      return;
    }

    if (
      this.previousRoute &&
      this.shouldStoreFor(this.currentRoute, this.previousRoute)
    ) {
      // Restore the scroll position of the current route
      const restoreRouteUrl = this.getPath(this.currentRoute);
      this.scrollToPosition(this.scrollPositions[restoreRouteUrl] || [0, 0]);
    }

    // Store the scroll position when navigating away from the
    // current route to a route we want to store it for
    const currentRoute = this.currentRoute;
    this.route$
      .pipe(
        skip(1),
        take(1),
        takeUntil(this.destroy$),
        filter((nextRoute) => this.shouldStoreFor(currentRoute, nextRoute))
      )
      .subscribe(() => {
        const storeRouteUrl = this.getPath(currentRoute);
        this.scrollPositions[storeRouteUrl] = this.currentScrollPosition;
      });
  }

  private getScrollPosition(): [number, number] {
    return this.viewportScroller.getScrollPosition();
  }

  private scrollToPosition(position: [number, number]): void {
    this.viewportScroller.scrollToPosition(position);
  }

  /**
   * Returns the absolute path for a given route or / for null.
   */
  private getPath(route: Option<ActivatedRouteSnapshot>): string {
    if (!route) {
      return '/';
    }
    return (
      '/' +
      route.pathFromRoot
        .map((r) => r.routeConfig && r.routeConfig.path)
        .filter((r) => r)
        .join('/')
    );
  }

  /**
   * Returns whether the given route requires storing of the scroll
   * position or not.
   */
  private requiresStoring(route: ActivatedRouteSnapshot): boolean {
    return Boolean(
      route &&
        route.routeConfig &&
        route.routeConfig.data &&
        Array.isArray(route.routeConfig.data.restoreScrollPositionFrom) &&
        route.routeConfig.data.restoreScrollPositionFrom.length > 0
    );
  }

  /**
   * Returns whether the scroll position of `storeRoute` should be
   * stored, when navigation to `forRoute` and restored when
   * navigation back from `forRoute` to `storeRoute`.
   */
  private shouldStoreFor(
    storeRoute: ActivatedRouteSnapshot,
    forRoute: ActivatedRouteSnapshot
  ): boolean {
    const restoreScrollPositionFrom =
      storeRoute &&
      storeRoute.routeConfig &&
      storeRoute.routeConfig.data &&
      Array.isArray(storeRoute.routeConfig.data.restoreScrollPositionFrom)
        ? storeRoute.routeConfig.data.restoreScrollPositionFrom
        : [];
    return restoreScrollPositionFrom.indexOf(this.getPath(forRoute)) !== -1;
  }
}

function isActivationEnd(event: any): event is ActivationEnd {
  return event instanceof ActivationEnd;
}

function isNavigationStart(event: any): event is NavigationStart {
  return event instanceof NavigationStart;
}

function isNavigationEnd(event: any): event is NavigationEnd {
  return event instanceof NavigationEnd;
}
