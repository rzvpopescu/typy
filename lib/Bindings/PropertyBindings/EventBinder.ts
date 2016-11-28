import {PropertyBinder} from './PropertyBinder';
import {ExpressionsHelper} from '../ExpressionsHelper';

export abstract class EventBinder extends PropertyBinder {

    protected BINDING_ATTRIBUTE:string; //"event.bind";

    protected EVENT_NAME:string; // "event";

    elementBind(element: HTMLElement, viewModel: any, expression: string): void {

        let evaluatedFunction = ExpressionsHelper.getEvaluatedFunctionExpression(expression, viewModel);

        element.addEventListener(this.EVENT_NAME, function (event: MouseEvent) {

            this.handleElementSpecificActions(element, viewModel, event);

            this.handleBindingAction(evaluatedFunction, viewModel, event);
            

        }.bind(this));
    }

    handleElementSpecificActions(element: HTMLElement,viewModel:any, event: Event) {
      
    }

    handleBindingAction(action: Function, viewModel: any, event: Event) {        

        if (action){
         
           action(viewModel,event);

        }           

    }

}