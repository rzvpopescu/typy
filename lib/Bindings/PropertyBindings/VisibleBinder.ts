import {PropertyBinder} from './PropertyBinder';
import {ExpressionsHelper} from '../ExpressionsHelper';
import {ObserverEngine} from '../../Observer/Observer';

export class VisibleBinder extends PropertyBinder {

    protected BINDING_ATTRIBUTE = "visible.bind";

    elementBind(element: HTMLElement, viewModel: any, expression: string): void {
               
        ObserverEngine.observeExpression(expression, viewModel, (value: any, oldValue: any) => {
         
          (<HTMLInputElement>element).hidden  = !value;
            
        });        

    }

}