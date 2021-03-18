import {DOCUMENT} from '@angular/common';
import {Directive, ElementRef, Inject, Output} from '@angular/core';
import {preventDefault, typedFromEvent} from '@taiga-ui/cdk';
import {TUI_ELEMENT_REF} from '@taiga-ui/core';
import {distinctUntilChanged, map, switchMap, takeUntil} from 'rxjs/operators';

// @dynamic
@Directive({
    selector: '[tuiResized]',
})
export class TuiResizedDirective {
    @Output()
    readonly tuiResized = typedFromEvent(this.elementRef.nativeElement, 'mousedown').pipe(
        preventDefault(),
        switchMap(() => {
            const {width, right} = this.parentRef.nativeElement.getBoundingClientRect();

            return typedFromEvent(this.documentRef, 'mousemove').pipe(
                distinctUntilChanged(),
                map(({clientX}) => width + clientX - right),
                takeUntil(typedFromEvent(this.documentRef, 'mouseup')),
            );
        }),
    );

    constructor(
        @Inject(DOCUMENT) private readonly documentRef: Document,
        @Inject(ElementRef)
        private readonly elementRef: ElementRef<HTMLElement>,
        @Inject(TUI_ELEMENT_REF)
        private readonly parentRef: ElementRef<HTMLTableHeaderCellElement>,
    ) {}
}
