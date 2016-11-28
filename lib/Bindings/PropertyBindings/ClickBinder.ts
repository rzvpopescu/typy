import {EventBinder} from './EventBinder';
import {ExpressionsHelper} from '../ExpressionsHelper';

export class ClickBinder extends EventBinder {

    protected BINDING_ATTRIBUTE:string  = 'click.bind';

    protected EVENT_NAME:string = 'click';

    handleElementSpecificActions(element: HTMLElement,viewModel:any, event: Event) {

        if ((<HTMLInputElement>element).type !== 'checkbox') {

            event.preventDefault();

        }
    }
}