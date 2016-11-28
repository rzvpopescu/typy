import {PropertyBinder} from './PropertyBinder';
import {ExpressionsHelper} from '../ExpressionsHelper';
import {ObserverEngine} from '../../Observer/Observer';

export class TextBinder extends PropertyBinder {

    protected BINDING_ATTRIBUTE = "text.bind";

    elementBind(element: HTMLElement, viewModel: any, expression: string): void {

        ObserverEngine.observeExpression(expression,viewModel,(value:any,oldValue:any)=>{
            
            element.innerText =  value;

        });
        
    }
}