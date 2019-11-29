import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, select } from '@storybook/addon-knobs';
import SlotLabel from '../imports/ui/components/stories/SlotLabel';

const selected = {
    textSlot1: { type: 'text', name: 'textSlot1', slotValue: 'null' },
    booleanSlot4: { type: 'boolean', name: 'booleanSlot4', slotValue: 'null' },
};

function SlotLabelWrapped(props) {
    const { value } = props;
    // Here the user of the component needs to paas the initialValue of slot for the slotValue
    const [defaultAction, setActionName] = useState({ type: 'text', name: 'textSlot1', slotValue: 'null' });
    return (
        <SlotLabel
            {...props}
            value={defaultAction}
            onChange={setActionName}
        />
    );
}

storiesOf('Slot Label', module)
    .addDecorator(withKnobs)
    .add('default', () => (
        <SlotLabelWrapped value={select('Selected slot', selected, selected.textSlot1)} />
    ));
