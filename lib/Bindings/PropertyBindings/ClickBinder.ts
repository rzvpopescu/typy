import { EventBinder } from './EventBinder';
import { ExpressionsHelper, CompiledFunction } from '../ExpressionsHelper';

export class ClickBinder extends EventBinder {

    protected BINDING_ATTRIBUTE: string = 'click.bind';

    protected EVENT_NAME: string = 'click';

    handleEvent(action: CompiledFunction, viewModel: any, event: Event) {
        var element = event.target;
        if ((<HTMLInputElement>element).type !== 'checkbox') {

            event.preventDefault();

        }

        super.handleEvent(action, viewModel, event);
    }
}