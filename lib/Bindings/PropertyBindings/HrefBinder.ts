import {PropertyBinder} from './PropertyBinder';
import {ObserverEngine} from '../../Observer/Observer';

export class HrefBinder extends PropertyBinder {

    protected BINDING_ATTRIBUTE = "href.bind";

    elementBind(element: HTMLElement, viewModel: any, expression: string): void {

        ObserverEngine.observeExpression(expression,viewModel,(value:any,oldValue:any)=>{
            
            element.setAttribute('href', value);

        });
        
    }
}