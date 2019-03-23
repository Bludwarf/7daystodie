import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[appCustomIconTint]'
})
export class CustomIconTintDirective {
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) { }

  @Input() set appCustomIconTint(hexColor: string) {
    if (hexColor && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hexColor && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }

}
