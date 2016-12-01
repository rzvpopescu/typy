import { PropertyBinder } from './PropertyBinder';
import { ExpressionsHelper, CompiledFunction } from '../ExpressionsHelper';

export abstract class EventBinder extends PropertyBinder {

    protected BINDING_ATTRIBUTE: string; //"event.bind";

    protected EVENT_NAME: string; // "event";

    elementBind(element: HTMLElement, viewModel: any, expression: string): void {

        let compiledFunction = ExpressionsHelper.compileExpression(expression);

        element.addEventListener(this.EVENT_NAME, function (event: MouseEvent) {

            this.handleEvent(compiledFunction, viewModel, event);

        }.bind(this));
    }

    handleEvent(action: CompiledFunction, viewModel: any, event: Event): void {

        if (action) {

            action(viewModel, {
                event: event
            });

        }

    }

}