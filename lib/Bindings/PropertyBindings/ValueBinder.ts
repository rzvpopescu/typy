import {PropertyBinder} from './PropertyBinder';
import {ExpressionsHelper} from '../ExpressionsHelper';
import {ObserverEngine} from '../../Observer/Observer';

export class ValueBinder extends PropertyBinder {

    protected BINDING_ATTRIBUTE = "value.bind";

    elementBind(element: HTMLElement, viewModel: any, expression: string): void {

        this.handleSpecificElementBind(element,viewModel,expression);

        ObserverEngine.observeExpression(expression, viewModel, (value: any, oldValue: any) => {

            (<HTMLInputElement>element).value = value;

        });

    }

    handleSpecificElementBind(element:HTMLElement,viewModel:any,expression:string):void{

        let elementType = (<HTMLInputElement>element).type;

        switch (elementType) {
            case 'select-one':
                this.handleSelectElement(<HTMLSelectElement>element,viewModel,expression);
                break;
            case 'text':
            case 'number':
                this.handleTextInputElement(<HTMLInputElement>element,viewModel,expression);
            default:
                break;
        }

    }

    handleSelectElement(element:HTMLSelectElement,viewModel:any,expression:string):void{
        
        element.addEventListener('change',(ev)=>{

            let selectedOptions = element.selectedOptions;
            let value =  (<HTMLOptionElement> selectedOptions[0]).value;
            super.setExpressionValue(expression,viewModel,value);               

        });

    }

    handleTextInputElement(element:HTMLInputElement,viewModel:any,expression:string):void{                           
         (<HTMLInputElement>element).addEventListener('input', (ev) => {            
            let value =  (<HTMLInputElement>element).value;
            super.setExpressionValue(expression,viewModel,value);
        });
    }   
}