import {PropertyBinder} from './PropertyBinder';
import {ExpressionsHelper} from '../ExpressionsHelper';
import {HtmlHelper} from '../HtmlHelper';
import {ObserverEngine} from '../../Observer/Observer';
import {ComponentBinder} from '../ComponentBindings/ComponentBinder';

export class IfBinder extends PropertyBinder {

    protected BINDING_ATTRIBUTE = "if.bind";

    elementBind(element: HTMLElement, viewModel: any, expression: string): void {

           var innerElements: HTMLElement[] = Array.prototype.map.call(element.children, (child: HTMLElement) => {

            return child.cloneNode(true);

        });

 
          ObserverEngine.observeExpression(expression, viewModel, (value: any, oldValue: any) => {

            this.applyBinding(element, innerElements, value);

        });

    }


    applyBinding(element: HTMLElement, innerElements: HTMLElement[], value: any) {

        HtmlHelper.clearChildrens(element);

        if(this.shouldAddInnerElements(value)){            

            Array.prototype.forEach.call(innerElements, (child: HTMLElement) => {

                let childNode = child.cloneNode(true);
                
                let binder = new ComponentBinder();

                binder.executeBindings(childNode as HTMLElement).then(result => {

                    if (result) {

                        result.forEach(component => {

                            element.appendChild(component.view);

                        });
                    }
                    else{

                        element.appendChild(childNode);

                    }

                });

            });

        }

    }


    /**
     * Indicates if based on the value , the inner elements should be added
     * 
     * @param {boolean} value
     * @returns {boolean}
     */
    shouldAddInnerElements(value:boolean):boolean{

        return value;

    }
       
}