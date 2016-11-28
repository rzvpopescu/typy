import {PropertyBinder} from './PropertyBinder';
import {ExpressionsHelper} from '../ExpressionsHelper';
import {HtmlHelper} from '../HtmlHelper';
import {ObserverEngine} from '../../Observer/Observer';

export class ClassBinder extends PropertyBinder {

    protected BINDING_ATTRIBUTE = "class.bind";

    elementBind(element: HTMLElement, viewModel: any, expression: string): void {

        let cssExpressions = expression.split(',');

        cssExpressions.forEach(expr=>{
                        
              ObserverEngine.observeExpression(expr.trim(), viewModel, (value: any, oldValue: any) => {

                    if( oldValue!==undefined && oldValue.trim().length !== 0){

                        element.classList.toggle(oldValue);

                    }

                    if(value !==undefined && value.trim().length !== 0){

                        element.classList.toggle(value);                    

                    }

            });
            
        });        
    }  
}