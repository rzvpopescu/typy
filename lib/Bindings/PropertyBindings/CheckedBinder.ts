import {PropertyBinder} from './PropertyBinder';
import {ExpressionsHelper} from '../ExpressionsHelper';
import {ObserverEngine} from '../../Observer/Observer';

export class CheckedBinder extends PropertyBinder{

    protected BINDING_ATTRIBUTE = 'checked.bind';
    
    elementBind(element:HTMLElement,viewModel:any,expression:string):void {

        element.onchange = (ev)=>{
            
            let checked = (<HTMLInputElement>element).checked;

            super.setExpressionValue(expression,viewModel,checked);
            
        };

         ObserverEngine.observeExpression(expression, viewModel, (value: any, oldValue: any) => {

            (<HTMLInputElement>element).checked = value;

        });

    }
}