import { Directive, HostListener, ElementRef, HostBinding } from '@angular/core';

@Directive({
    selector: '[appDropdown]'
})
export class DropdownDirective {
    constructor(private elRef: ElementRef) {}

    @HostBinding('class.open') isOpen: boolean = false;

    @HostListener('document:click', ['$event'])
    onClick(event: Event){
        this.isOpen = this.elRef.nativeElement.contains(event.target) ? !this.isOpen : false;
    }
}